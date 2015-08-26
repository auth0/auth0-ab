var Experiment = require('../../lib/models/experiment');
var NullAnalyticsService = require('../../lib/services/null_analytics_service');
var variantFabricator = require('./variant_fabricator');
var _ = require('lodash');

module.exports = {
  fabricateBasic: function(options) {
    var attributes = this.attributesBasic(options);

    return Experiment.parse(attributes, { analytics: new NullAnalyticsService() });
  },

  attributesBasic: function(options) {
    return _.extend({
      name: _.uniqueId('experiment'),
      variants: [
        variantFabricator.attributesBasic(),
        variantFabricator.attributesBasic()
      ]
    }, options);
  }
};
