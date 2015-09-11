var _ = require('lodash');

module.exports = {
  fabricateAuth0MetricsFake: function () {
    function FakeAuth0Metrics() {
      this._traits = {};
    }

    FakeAuth0Metrics.prototype.track = function(newTraits) { this._traits = _.extend(this._traits, newTraits); };
    FakeAuth0Metrics.prototype.traits = function() { return this._traits; };
    FakeAuth0Metrics.prototype.ready = function(cb) { cb(); };
    FakeAuth0Metrics.prototype.identify = function(newTraits) { this._traits = _.extend(this._traits, newTraits); };

    return FakeAuth0Metrics;
  }
};
