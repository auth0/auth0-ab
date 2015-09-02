'use strict';

var RawVariantProperty = require('./raw_variant_property');
var JsVariantProperty = require('./js_variant_property');

var _ = require('lodash');

var PROPERTY_CLASS_BY_TYPE = {
  'raw': RawVariantProperty,
  'js': JsVariantProperty
};

function VariantProperties(data) {
  data = data || {};

  this.variantProperties = data.variantProperties || [];
}

VariantProperties.parse = function(data) {
  var variantProperties = _.map(data.variantProperties, function(value, name) {
    var descriptor = _.isObject(value) ? value : { value: value };
    var valueType = _.isObject(value) ? (value.type || 'raw').toLowerCase() : 'raw';

    var PropertyClass = PROPERTY_CLASS_BY_TYPE[valueType];

    if (!PropertyClass) {
      throw new Error('Unexpected property type. Property: ' + name + ' type: ' + valueType);
    }

    return PropertyClass.parse(_.extend({ name: name }, descriptor));
  });

  return new VariantProperties({ variantProperties: variantProperties });
};

VariantProperties.prototype.getPropertiesByType = function (type) {
  return _.filter(this.variantProperties, function (p) { return p.type === type; } );
};

VariantProperties.prototype.findByName = function(name) {
  return _.find(this.variantProperties, function(property) {
    return property.name === name;
  });
};

VariantProperties.prototype.toPlainObject = function() {
  return this.variantProperties.map(function(property) { return property.toPlainObject(); });
};

VariantProperties.prototype.toJSON = function () {
  var plainProperties = this.toPlainObject();

  return plainProperties.reduce(function(prev, curr) {
    prev[curr.name] = curr.value;
    return prev;
  }, {});
};

module.exports = VariantProperties;
