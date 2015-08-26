var _ = require('lodash');

module.exports = {
  fabricateAuth0MetricsFake: function () {
    function FakeAuth0Metrics() {
      this._segment = new FakeSegment();
    }

    FakeAuth0Metrics.prototype.segment = function (){ return this._segment; };
    FakeAuth0Metrics.prototype.traits = function(cb) { return this._segment.traits(); };
    FakeAuth0Metrics.prototype.ready = function(cb) { cb(); };

    return FakeAuth0Metrics;
  }
};

function FakeSegment() {
  this._traits = {};
}

FakeSegment.prototype.identify = function(newTraits) { this._traits = _.extend(this._traits, newTraits); };
FakeSegment.prototype.traits = function() { return this._traits; };

