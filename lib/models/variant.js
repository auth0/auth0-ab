"use strict";

var VariantProperties = require('./variant_properties');

function Variant(data) {
  this.name = data.name;
  this.settings = data.settings;
  this.properties = data.properties || new VariantProperties();
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

Variant.prototype.toPlainObject = function() {

  return {
    name: this.name,
    settings: this.settings,
    properties: this.properties.toPlainObject()
  };
};

Variant.prototype.toJSON = function () {
  return this.properties ? this.properties.toJSON() : null;
};

module.exports = Variant;
