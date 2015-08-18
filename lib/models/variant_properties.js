"use strict";

var VariantProperty = require('./variant_property');
var _ = require('lodash');

function VariantProperties(data) {
  this.variantProperties = data.variantProperties || [];
}

VariantProperties.parse = function(data) {
  var variantProperties = _.map(data.variantProperties, function(value, name) {
    var valueRaw = _.isObject(value) ? value.value : value;
    var valueType = _.isObject(value) ? (value.type || 'raw') : 'raw';

    return VariantProperty.parse({
      name: name,
      value: valueRaw,
      type: valueType
    });
  });

  return new VariantProperties({ variantProperties: variantProperties });
};

VariantProperties.prototype.findByName = function(name) {
  return _.find(this.variantProperties, function(property) {
    return property.name === name;
  });
};

module.exports = VariantProperties;
