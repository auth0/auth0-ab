var Variant = require('../../lib/models/variant');
var _ = require('lodash');

module.exports = {
  fabricateBasic: function(options) {
    var attributes = this.attributesBasic(options);

    return Variant.parse(attributes);
  },

  attributesBasic: function(options) {
    return _.extend({
      name: _.uniqueId('variant'),
      settings: { weight: Math.random() },
      properties: {
        'title': 'You have won one millon dolars! Click here'
      }
    }, options);
  }
};
