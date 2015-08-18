"use strict";

var _ = require('lodash');

var VALID_TYPES = ['raw', 'js'];

function VariantProperty(data) {
  if (!data.name) {
    throw Error('Name is required');
  }

  if (!data.type) {
    throw Error('Type is required');
  }

  var type = data.type.toLowerCase();

  if (!_.contains(VALID_TYPES, type)) {
    throw Error('Invalid type. ' + data.type + ' Valid types are: ' + JSON.stringify(VALID_TYPES));
  }

  this.name = data.name;
  this.value = data.value;
  this.type = type;
}

VariantProperty.parse = function(data) {
  return new VariantProperty(data);
};

VariantProperty.prototype.getType = function() {
  return this.type;
};

VariantProperty.prototype.getValue = function() {
  return this.value;
};

VariantProperty.prototype.runInContext = function(/* arguments... */) {
  if (this.type !== 'js') {
    throw new Error('Property is not runnable');
  }

  // WARNING: Provided javascript source must be trustable! Don't try to execute user provided Javascript!
  // It is really dangerous.

  // TODO: Eval function from the string value and run it.
};

module.exports = VariantProperty;
