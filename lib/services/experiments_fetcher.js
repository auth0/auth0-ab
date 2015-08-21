"use strict";

var BPromise = require('bluebird');
var Experiments = require('../models/experiments');

function ExperimentsFetcher(options) {
  options = options || {};

  this.fetchFn = options.fetchFn;
}

ExperimentsFetcher.prototype.fetch = function() {
  return BPromise.resolve(this.fetchFn()).then(function(experiments) {
    return Experiments.parse({ experiments: experiments });
  });
};


module.exports = ExperimentsFetcher;
