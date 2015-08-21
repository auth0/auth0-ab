var RawVariantProperty = require('../../lib/models/raw_variant_property');
var JsVariantProperty = require('../../lib/models/js_variant_property');
var _ = require('lodash');

module.exports = {
  fabricateBasic: function(options) {
    var attributes = this.attributesBasic(options);

    return RawVariantProperty.parse(attributes);
  },

  attributesBasic: function(options) {
    return _.extend({
      name: _.uniqueId('raw-variant-property'),
      type: 'raw',
      value: _.uniqueId('a value')
    }, options);
  },

  fabricateJsBasic: function(options) {
    var attributes = this.attributesBasic(options);

    return JsVariantProperty.parse(attributes);
  },

  attributesJsBasic: function(options) {
    return _.extend({
      name: _.uniqueId('js-variant-property'),
      type: 'js',
      body: 'alert("Hello " + name + "!")',
      args: ['name']
    }, options);
  }
};
