'use strict';

var _ = require('lodash');
var BPromise = require('bluebird');
var unflatten = require('flat').unflatten;

function Auth0MetricsAnalyticsService(options) {
  options = options || {};

  if (!options.metrics && !options.segmentKey) {
    throw new Error('SegmentKey is required');
  }

  if (!options.metrics && !options.dwhEndpoint) {
    throw new Error('DwhEndpoint is required');
  }

  this.propertyPrefix = options.propertyPrefix || 'ab';
  this.segmentKey = options.segmentKey;
  this.dwhEndpoint = options.dwhEndpoint;
  this.website = options.website;

  this.metrics = options.metrics || null;
}

Auth0MetricsAnalyticsService.prototype.setCurrentVariantName = function(experimentName, variantName) {
  var data = Object.create(null);
  data[this.propertyPrefix + '.' + experimentName] = variantName;

  this.getMetrics().identify(data);
  this.getMetrics().track('ab:viewed-' + experimentName, {
    experiment_id: experimentName,
    experiment_name: experimentName,
    variation_id: variantName,
    variation_name: variantName
  });
};

Auth0MetricsAnalyticsService.prototype.getCurrentVariantName = function(experimentName) {
  var traits =  unflatten(this.getMetrics().traits() || {});
  var variantsByName = traits[this.propertyPrefix] || {};

  return variantsByName[experimentName];
};

Auth0MetricsAnalyticsService.prototype.prepare = function() {
  var metricsPromise;

  if (this.metrics) {
    // If you provide an instance it is assumed to be ready
    metricsPromise = BPromise.resolve(this.metrics);
  } else {
    var Auth0Metrics = this._loadMetricsClass();

    metricsPromise = new BPromise(_.bind(function(resolve) {
      var metrics =  new Auth0Metrics(this.segmentKey, this.dwhEndpoint, this.website);

      metrics.ready(function() {
        resolve(metrics);
      });
    }, this));
  }

  return metricsPromise.bind(this).then(function(metrics) {
    this.metrics = metrics;

    return metrics;
  });
};


Auth0MetricsAnalyticsService.prototype.getMetrics = function() {
  if (!this.metrics) {
    throw new Error('Metrics is not available, have you called prepare method?')
  }

  return this.metrics;
};

Auth0MetricsAnalyticsService.prototype._loadMetricsClass = function() {
  if (typeof Auth0Metrics === 'function') {
    return Auth0Metrics;
  }

  throw new Error('Auth0Metrics is not available. Auth0Metrics is required for this integration. ' +
      'Please load it before starting the integration.');
};

module.exports = Auth0MetricsAnalyticsService;
