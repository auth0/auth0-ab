"use strict";

function Integrations() {
  this.integrations = Object.create(null);
}

Integrations.prototype.add = function(name, Clazz) {
  if (this.integrations[name] && this.integrations[name] !== Clazz) {
    throw new Error('There is another integration with the same name');
  }

  this.integrations[name] = Clazz;
};

Integrations.prototype.remove = function(name) {
  delete this.integrations[name];
};

Integrations.prototype.get = function(name) {
  return this.integrations[name];
};

Integrations.prototype.build = function(name, experiments) {
  if (!this.integrations[name]) {
    throw new Error('There is not such integration: ' + name);
  }

  var Clazz = this.integrations[name];

  return new Clazz({ experiments: experiments });
};

module.exports = Integrations;
