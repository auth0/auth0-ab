"use strict";

var Experiment = require('./experiment');
var _ = require('lodash');

function Experiments(data) {
  data = data || {};

  this.experiments = data.experiments || [];
}

Experiments.parse = function(experimentsData) {
  var experiments;

  if (!experimentsData) { experiments = []; }

  experiments = experimentsData.experiments.map(function(experimentData) {
    return Experiment.parse(experimentData);
  });

  return new Experiments({ experiments: experiments });
};

Experiments.prototype.findByName = function(name) {
  return _.find(this.experiments, function(experiment) {
    return experiment.name === name;
  });
};

Experiments.prototype.findAllByName = function(names) {
  var experiments = _.filter(this.experiments, function(experiment) {
    return _.contains(names, experiment.name);
  });

  return new Experiments({ experiments: experiments });
};

Experiments.prototype.runAll = function(runnable) {
  if (runnable && !_.isArray(runnable)) {
    throw new Error('runAll(runnable): runnable must be an array of experiment names');
  }

  var experimentsCollection = runnable ? this.findAllByName(runnable) : this;

  experimentsCollection.experiments.forEach(function(experiment) {
    return experiment.run();
  });

  return experimentsCollection;
};

module.exports = Experiments;
