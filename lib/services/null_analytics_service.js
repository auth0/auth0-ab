var BPromise = require('bluebird');
var _ = require('lodash');

function NullAnalyticsService(options) {
}

NullAnalyticsService.prototype.prepare = function() {
  return BPromise.resolve();
};

NullAnalyticsService.prototype.setCurrentVariantName = _.noop;

NullAnalyticsService.prototype.getCurrentVariantName = _.noop;

module.exports = NullAnalyticsService;
