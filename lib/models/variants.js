"use strict";

var Variant = require('./variant');
var WeightBasedVariantSelector = require('./variant_selectors/weight_based_variant_selector');
var _ = require('lodash');

function Variants(variantsData) {
  this.variants = variantsData.variants;
  this._variantSelector = new WeightBasedVariantSelector(this.variants);
}

Variants.parse = function(data) {
  var variants = data.variants.map(function(variantData) {
    return Variant.parse(variantData);
  });

  return new Variants({ variants: variants });
};

Variants.prototype.select = function() {
  return this._variantSelector.select();
};

Variants.prototype.findByName = function(name) {
  return _.find(this.variants, function(variant) {
    return variant.name === name;
  });
};

Variants.prototype.toPlainObject = function() {
  return this.variants.map(function(variant) { return variant.toPlainObject(); });
};

module.exports = Variants;
