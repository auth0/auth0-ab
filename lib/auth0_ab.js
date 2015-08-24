"use strict";

var Experiments = require('./models/experiments');
var Integrations = require('./integrations/integrations');
var PageJS = require('./integrations/page_js');
var Auth0MetricsIntegration = require('./integrations/auth0_metrics_integration');
var ExperimentsFetcher = require('./services/experiments_fetcher');
var NullAnalyticsService = require('./services/null_analytics_service');
var EventEmitter = require('events').EventEmitter;
var BPromise = require('bluebird');
var _ = require('lodash');

function Auth0AB(options) {
  options = options || {};

  this.ready = false;
  this.analytics = null;
  this.experimentsFetcherService = null;
  this.experiments = null;
  this.events = new EventEmitter();

  this.configure(_.extend({
    fetchFn: null,
    analytics: null
  }, options));
}

Auth0AB.integrations = new Integrations();

Auth0AB._setup = function() {
  Auth0AB.integrations.add('pagejs', PageJS);
  Auth0AB.integrations.add('auth0metrics', Auth0MetricsIntegration);
};

Auth0AB.prototype.configure = function(options) {

  if (!_.isUndefined(options.analytics)) {
    this.analytics = options.analytics ? options.analytics : new NullAnalyticsService();

    this.experimentsFetcherService = new ExperimentsFetcher({
      fetchFn: this._fetchFn,
      analytics: options.analytics
    });
  }

  if (!_.isUndefined(options.fetchFn)) {
    this._fetchFn = options.fetchFn || function() {
      return options.experiments || [];
    };

    this.experimentsFetcherService = new ExperimentsFetcher({
      fetchFn: this._fetchFn,
      analytics: this.analytics
    });
  }
};

Auth0AB.prototype.start = function() {
  return this.analytics.prepare().bind(this).then(function() {
    return this.fetch();
  }).then(function() {
    this.ready = true;
    this.events.emit('ready', this);

    return this;
  });
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

Auth0AB.prototype.onReady = function(cb) {
  if (this.ready) { cb(this); }

  this.events.on('ready', cb);
};

Auth0AB.prototype.setCurrentVariantsByName = function(variantsByName) {
  return this.getExperiments().setCurrentVariantsByName(variantsByName);
};

Auth0AB._setup();

module.exports = Auth0AB;
