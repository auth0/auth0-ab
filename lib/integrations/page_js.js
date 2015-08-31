'use strict';

var _ = require('lodash');

function PageJs(options) {
  this.auth0ab = options.auth0ab;
}

PageJs.prototype.middleware = function(runnable, experimentsAsJson) {

  return _.bind(function auth0ABPageJSMiddleware(context, next) {

    this.auth0ab.onReady(function(auth0ab) {
      var experiments = auth0ab.getExperiments().runAll(runnable);

      if (experimentsAsJson) {
        context.experiments = experiments.getCurrentProperties();
      } else {
        context.experiments = experiments;
      }

      next();
    });
  }, this);
};

module.exports = PageJs;
