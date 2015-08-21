"use strict";

var Experiments = require('./models/experiments');
var Integrations = require('./integrations/integrations');
var PageJS = require('./integrations/page_js');

function Auth0AB(options) {
  options = options || {};

  this.experiments = options.experiments ? Experiments.parse({ experiments: options.experiments }) : null;
}

Auth0AB.integrations = new Integrations();

Auth0AB._setup = function() {
  Auth0AB.integrations.add('pagejs', PageJS);
};

Auth0AB.prototype.getExperiments = function() {
  if (!this.experiments) {
    throw new Error("No experiments available. Are you trying to load experiments asynchronously? " +
      "Don't forget to wait for the promise to be resolved");
  }

  return this.experiments;
};

Auth0AB.prototype.integration = function(name) {
  return Auth0AB.integrations.build(name, this.getExperiments());
};

Auth0AB._setup();

module.exports = Auth0AB;
