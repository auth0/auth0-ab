var expect = require('chai').expect;
var NullAnalyticsService = require('../../lib/services/null_analytics_service');
var sinon = require('sinon');
var _ = require('lodash');
var experimentFabricator = require('../fabricators/experiment_fabricator');
var BPromise = require('bluebird');

describe('NullAnalyticsService', function() {

  describe('#prepare', function() {

    beforeEach(function() {
      this.service = new NullAnalyticsService();

      return this.service.prepare().bind(this).then(function() {
        this.resolved = true;
      });
    });

    it('returns a promise that resolves immediately', function() {
      // This is a kind of redundant since if the promise is not resolved the test
      // will fail because of timeout
      expect(this.resolved).to.be.true;
    });
  });

  describe('#getCurrentVariantName', function() {

    beforeEach(function() {
      this.service = new NullAnalyticsService();
    });

    it('it is callable', function() {
      expect(_.bind(function() {
        this.service.getCurrentVariantName('experiment-1');
      }, this)).not.to.throw()
    });
  });

  describe('#setCurrentVariantName', function() {

    beforeEach(function() {
      this.service = new NullAnalyticsService();
    });

    it('it is callable', function() {
      expect(_.bind(function() {
        this.service.setCurrentVariantName('experiment-1', 'variant-1');
      }, this)).not.to.throw()
    });
  });
});
