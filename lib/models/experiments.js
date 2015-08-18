"use strict";

var Experiment = require('./experiment');
var _ = require('lodash');

function Experiments(data) {
  this.experiments = data.experiments;
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

module.exports = Experiments;
