"use strict";

var _ = require('lodash');

function PageJs(options) {
  this.auth0ab = options.auth0ab;
}

PageJs.prototype.middleware = function(runnable) {

  return _.bind(function auth0ABPageJSMiddleware(context, next) {

    this.auth0ab.onReady(function(auth0ab) {
      context.experiments = auth0ab.getExperiments().runAll(runnable);

      next();
    });
  }, this);
};

module.exports = PageJs;
