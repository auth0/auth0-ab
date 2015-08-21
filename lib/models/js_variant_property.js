"use strict";

var _ = require('lodash');

function JSVariantProperty(data) {
  if (!data.name) {
    throw Error('Name is required');
  }

  if (!data.body) {
    throw Error('Body is required');
  }

  this.name = data.name;
  this.args = data.args || [];
  this.body = data.body;

  // It build a function on this way new Function(arg1, arg2, ..., body)
  // this is equal to (new (Function.bind.apply(Function, [Function].concat(this.args).concat([ this.body ]));
  this.fn = new (_.bind.apply(_, [ Function, Function ].concat(this.args).concat([ this.body ])));
}

JSVariantProperty.parse = function(data) {
  return new JSVariantProperty(data);
};

JSVariantProperty.prototype.runInContext = function(/* arguments... */) {
  return this.fn.apply(this, arguments);
};

module.exports = JSVariantProperty;
