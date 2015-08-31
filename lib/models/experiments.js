"use strict";

var Experiment = require('./experiment');
var _ = require('lodash');

function Experiments(data) {
  data = data || {};

  this.experiments = data.experiments || [];
}

Experiments.parse = function(experimentsData, options) {
  var experiments;

  if (!experimentsData) { experiments = []; }

  experiments = experimentsData.experiments.map(function(experimentData) {
    return Experiment.parse(experimentData, options);
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

Experiments.prototype.setCurrentVariantsByName = function(variantsByName) {
  _.forEach(variantsByName, function(variantName, experimentName) {
    var experiment = this.findByName(experimentName);

    experiment.setCurrentVariantByName(variantName);
  }, this);
};

Experiments.prototype.toPlainObject = function() {
  return this.experiments.map(function(experiment) {
    return experiment.toPlainObject();
  });
};

Experiments.prototype.getCurrentProperties = function () {
  return this.experiments.reduce(function (prev, curr) {
    prev[curr.name] = curr.getCurrentProperties();
    return prev;
  }, {});
};

Experiments.prototype.forEach = function(cb) {
  return _.forEach(this.experiments, cb);
};

module.exports = Experiments;
