"use strict";

var _ = require('lodash');

function WeightBasedVariantSelector(variants) {
  this.variants = variants;
}

WeightBasedVariantSelector.prototype.select = function() {
  var random = this._getRandom();
  var intervals = this._getIntervals();

  return _.find(intervals, function(interval) {
    return random >= interval.from && random <= interval.to;
  }).variant;
};

WeightBasedVariantSelector.prototype._getRandom = function() {
  // NOTE: This assumes that Math.random is good enough for the purpose
  // of this library
  return Math.random();
};

WeightBasedVariantSelector.prototype._getTotal = function() {
  return this.variants.reduce(function(soFar, variant) {
    return soFar + variant.settings.weight;
  }, 0);
};

WeightBasedVariantSelector.prototype._getIntervals = function() {
  var lastTo = 0;
  var total = this._getTotal();

  return this.variants.map(function(variant) {
    var from = lastTo;
    var to = (variant.getWeight() / total) + from;
    lastTo = to;

    return {
      variant: variant,
      from: from,
      to: to
    };
  });
};

module.exports = WeightBasedVariantSelector;
