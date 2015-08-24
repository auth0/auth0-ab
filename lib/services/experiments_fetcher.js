"use strict";

var BPromise = require('bluebird');
var Experiments = require('../models/experiments');

function ExperimentsFetcher(options) {
  options = options || {};

  this.fetchFn = options.fetchFn;
  this.analytics = options.analytics;
}

ExperimentsFetcher.prototype.fetch = function() {
  return BPromise.resolve(this.fetchFn()).bind(this).then(function(experiments) {
    return Experiments.parse({ experiments: experiments }, { analytics: this.analytics });
  });
};


module.exports = ExperimentsFetcher;
