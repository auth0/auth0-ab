"use strict";

var Auth0MetricsAnalyticsService = require('./auth0_metrics_analytics_service');

function Auth0MetricsIntegration(options) {
  this.auth0ab = options.auth0ab;
}

Auth0MetricsIntegration.prototype.start = function(options) {
  this.analytics = new Auth0MetricsAnalyticsService(options);

  this.auth0ab.configure({
    analytics: this.analytics
  });
};

Auth0MetricsIntegration.prototype.getMetrics = function(options) {
  if (!this.analytics) {
    throw new Error('Analytics service is not available. Have you called start method?')
  }

  return this.analytics.getMetrics();
};

module.exports = Auth0MetricsIntegration;

