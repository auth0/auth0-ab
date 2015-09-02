"use strict";

var _ = require('lodash');

function JSVariantProperty(data) {
  if (!data.name) {
    throw Error('Name is required');
  }

  if (!data.fn) {
    throw Error('Fn is required');
  }

  this.name = data.name;
  this.fn = data.fn;
}

JSVariantProperty.parse = function(data) {
  var fn;

  if (_.isFunction(data.fn)) {
    fn = data.fn;
  } else if (data.body) {
    var args = data.args || [];
    var body = data.body;

    // It builds a function on this way: new Function(arg1, arg2, ..., body)
    // This is the same as (new (Function.bind.apply(Function, [Function].concat(this.args).concat([ this.body ]));
    fn = new (_.bind.apply(_, [ Function, Function ].concat(args).concat([ body ])));
  }

  return new JSVariantProperty({ name: data.name, fn: fn });
};

JSVariantProperty.prototype.runInContext = function(/* arguments... */) {
  return this.fn && this.fn.apply(this, arguments);
};

JSVariantProperty.prototype.toPlainObject = function() {
  return {
    type: 'js',
    name: this.name,
    fn: this.fn
  };
};

module.exports = JSVariantProperty;
