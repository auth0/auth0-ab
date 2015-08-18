var VariantProperty = require('../../lib/models/variant_property');
var _ = require('lodash');

module.exports = {
  fabricateBasic: function(options) {
    var attributes = this.attributesBasic(options);

    return VariantProperty.parse(attributes);
  },

  attributesBasic: function(options) {
    return _.extend({
      name: _.uniqueId('variant-property'),
      type: 'raw',
      value: _.uniqueId('a value')
    }, options);
  }
};
