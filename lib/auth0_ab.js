"use strict";

var Experiments = require('./models/experiments');
var Integrations = require('./integrations/integrations');
var PageJS = require('./integrations/page_js');
var ExperimentsFetcher = require('./services/experiments_fetcher');
var BPromise = require('bluebird');
var _ = require('lodash');

function Auth0AB(options) {
  options = options || {};

  this.experimentsFetcherService = new ExperimentsFetcher({ fetchFn: options.fetchFn });
  this.experiments = options.experiments ? Experiments.parse({ experiments: options.experiments }) : null;
}

Auth0AB.integrations = new Integrations();

Auth0AB._setup = function() {
  Auth0AB.integrations.add('pagejs', PageJS);
};

Auth0AB.prototype.getExperiments = function() {
  if (!this.experiments) {
    throw new Error("No experiments available. Are you trying to load experiments asynchronously? " +
      "Don't forget to wait for the promise to be resolved");
  }

  return this.experiments;
};

Auth0AB.prototype.integration = function(name) {
  return Auth0AB.integrations.build(name, this);
};

Auth0AB.prototype.fetch = function() {
  if (this.experiments) { return BPromise.resolve(this); }

  return this.experimentsFetcherService.fetch().then(_.bind(function(experiments) {
    this.experiments = experiments;
  }, this))
  .then(_.bind(function() {
    return this;
  }, this));
};

Auth0AB._setup();

module.exports = Auth0AB;
