"use strict";

var VariantProperties = require('./variant_properties');

function Variant(data) {
  this.name = data.name;
  this.settings = data.settings;
  this.properties = data.properties;
}

Variant.parse = function(data) {
  var properties = VariantProperties.parse({ variantProperties: data.properties });

  return new Variant({ name: data.name, settings: data.settings, properties: properties });
};

Variant.prototype.getProperty = function(name) {
  return this.properties.findByName(name);
};

Variant.prototype.getWeight = function() {
  return this.settings.weight;
};

module.exports = Variant;
