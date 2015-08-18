"use strict";

var Variants = require('./variants');

function Experiment(data, options) {
  if (!data.name) {
    throw new Error('Name is required');
  }

  this.name = data.name;
  this.variants = data.variants || new Variants({ variants: [] });
}

Experiment.parse = function(data) {
  var variants = Variants.parse({ variants: data.variants });

  return new Experiment({ name: data.name, variants: variants });
};

Experiment.prototype.getCurrentVariant = function() {
  return this.current || null;
};

Experiment.prototype.setCurrentVariantByName = function(name) {
  var current = this.findVariant(name);

  if (!current) {
    throw new Error('There is not variant with name: ' + name);
  }

  this.current = current;
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

  this.current = current;

  return current;
};

module.exports = Experiment;
