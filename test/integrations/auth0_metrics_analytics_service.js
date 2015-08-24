var expect = require('chai').expect;
var Auth0MetricsAnalyticsService = require('../../lib/integrations/auth0_metrics_analytics_service');
var _ = require('lodash');
var auth0metricsFabricator = require('../fabricators/auth0_metrics_fabricator');
var sinon = require('sinon');

describe('Auth0MetricsAnalyticsService', function() {

  beforeEach(function() {
    this.startingData = {
      segmentKey: 'test',
      dwhEndpoint: 'https://test.com/'
    };

    global.Auth0Metrics = auth0metricsFabricator.fabricateAuth0MetricsFake();

    this.service = new Auth0MetricsAnalyticsService(this.startingData);
  });

  describe('#prepare', function() {

    describe('when Auth0Metrics is not available', function() {

      describe('and not instance is provided', function() {
        beforeEach(function() {
          delete global.Auth0Metrics;
        });

        it('throws an exception', function() {
          expect(function() {
            this.service.prepare();
          }).to.throw();
        });
      });

      describe('and an instance is provided', function() {
        beforeEach(function() {
          var Metrics = auth0metricsFabricator.fabricateAuth0MetricsFake();

          this.service = new Auth0MetricsAnalyticsService(_.extend(this.startingData, { metrics: new Metrics() }));
        });

        it('does not throws an exception', function() {
          expect(function() {
            this.service.prepare();
          }).to.throw();
        });
      });

    });

    describe('when Auth0Metrics is available', function() {

      before(function() {
        sinon.stub(global.Auth0Metrics.prototype, 'ready', _.bind(function(cb) {
          this.ready = true;
          cb();
        }, this));

        return this.service.prepare();
      });

      it('returns a promise that resolves after the auth0metrics is ready', function() {
        expect(this.ready).to.be.true;
      });
    });
  });

  describe('#setCurrentVariantName', function() {

    beforeEach(function() {
      this.service = new Auth0MetricsAnalyticsService(_.extend(this.startingData, { propertyPrefix: 'test' }));

      return this.service.prepare().bind(this).then(function() {
        this.service.setCurrentVariantName('experiment 1', 'variant-1');
      })
    });

    it('reports value to analytic library', function() {
      expect(this.service.getCurrentVariantName('experiment 1')).to.equal('variant-1');
    });
  });

  describe('#getCurrentVariantName', function() {

    beforeEach(function() {
      this.service = new Auth0MetricsAnalyticsService(_.extend(this.startingData, { propertyPrefix: 'test' }));

      return this.service.prepare().bind(this).then(function() {
        this.service.setCurrentVariantName('experiment 1', 'variant-1');
        this.result = this.service.getCurrentVariantName('experiment 1');
      })
    });

    it('returns current value for the experiment name', function() {
      expect(this.result).to.equal('variant-1');
    });
  });
});
