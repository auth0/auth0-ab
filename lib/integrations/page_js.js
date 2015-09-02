'use strict';

var _ = require('lodash');

function PageJs(options) {
  this.auth0ab = options.auth0ab;
}

PageJs.prototype.middleware = function(runnable) {

  return _.bind(function auth0ABPageJSMiddleware(context, next) {

    this.auth0ab.onReady(function(auth0ab) {
      try {
        if (_.isArray(runnable)) {
          context.experiments = auth0ab.getExperiments().runAll(runnable);
        } else {
          context.experiments = auth0ab.getExperiments().runAllByPath(runnable);
        }
      } catch (e) {
        // fail silently
      } finally {
        next();
      }
    });
  }, this);
};

module.exports = PageJs;
