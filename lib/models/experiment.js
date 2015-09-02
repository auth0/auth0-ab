"use strict";

var Variants = require('./variants');

function Experiment(data, options) {
  if (!data.name) {
    throw new Error('Name is required');
  }

  this.name = data.name;
  this.variants = data.variants || new Variants({ variants: [] });
  this.analytics = options.analytics;
}

Experiment.parse = function(data, options) {
  var variants = Variants.parse({ variants: data.variants });

  return new Experiment({ name: data.name, path: data.path, variants: variants }, options);
};

Experiment.prototype.getCurrentVariant = function() {
  if (this.current) {
    return this.current;
  }

  var variantName = this.analytics.getCurrentVariantName(this.name);
  if (variantName) {
    var variant = this.findVariant(variantName);
    this.current = variant;
  }

  return this.current || null;
};

Experiment.prototype.setCurrentVariantByName = function(name) {
  var current = this.findVariant(name);

  if (!current) {
    throw new Error('There is not variant with name: ' + name);
  }

  this._setCurrentVariant(current);
};

Experiment.prototype.findVariant = function(name) {
  return this.variants.findByName(name);
};

Experiment.prototype.select = function() {
  return this.variants.select();
};

Experiment.prototype.run = function() {
  var current = this.getCurrentVariant();

  if (current) { return current; }

  current = this.select();

  this._setCurrentVariant(current);

  return current;
};

Experiment.prototype.getCurrentProperties = function () {
  var currentVariant = this.getCurrentVariant();

  if (!currentVariant || !currentVariant.properties) {
    return;
  }

  return currentVariant.toJSON();
};

Experiment.prototype.toPlainObject = function() {
  var currentVariant = this.getCurrentVariant();

  return {
    name: this.name,
    current: currentVariant && currentVariant.toPlainObject(),
    variants: this.variants.toPlainObject()
  };
};

Experiment.prototype._setCurrentVariant = function(variant) {
  this.current = variant;
  this.analytics.setCurrentVariantName(this.name, variant.name);
};

module.exports = Experiment;
