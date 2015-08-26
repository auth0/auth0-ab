"use strict";

function RawVariantProperty(data) {
  if (!data.name) {
    throw Error('Name is required');
  }

  this.name = data.name;
  this.value = data.value;
}

RawVariantProperty.parse = function(data) {
  return new RawVariantProperty(data);
};

RawVariantProperty.prototype.getValue = function() {
  return this.value;
};

RawVariantProperty.prototype.toPlainObject = function() {
  return {
    type: 'raw',
    name: this.name,
    value: this.value
  };
};

module.exports = RawVariantProperty;
