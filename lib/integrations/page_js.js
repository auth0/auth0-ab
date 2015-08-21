"use strict";

function PageJs(options) {
  this.experiments = options.experiments;
}

PageJs.prototype.middleware = function(runnable) {
  var selectedExperiments = this.experiments.runAll(runnable);

  return function auth0ABPageJSMiddleware(context, next) {
    context.experiments = selectedExperiments;

    next();
  };
};

module.exports = PageJs;
