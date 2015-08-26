var expect = require('chai').expect;
var Auth0AB = require('../../lib/auth0_ab');
var Auth0MetricsIntegration = require('../../lib/integrations/auth0_metrics_integration');
var Auth0MetricsAnalyticsService = require('../../lib/integrations/auth0_metrics_analytics_service');
var _ = require('lodash');
var experimentFabricator = require('../fabricators/experiment_fabricator');
var auth0metricsFabricator = require('../fabricators/auth0_metrics_fabricator');
var sinon = require('sinon');

describe('Auth0MetricsIntegration', function() {
  this.globals(['Auth0Metrics']);

  beforeEach(function() {
    this.startingData = {
      segmentKey: 'test',
      dwhEndpoint: 'https://test.com/'
    };

    global.Auth0Metrics = auth0metricsFabricator.fabricateAuth0MetricsFake();

    this.experimentsAttrs = [
      experimentFabricator.attributesBasic({ name: 'experiment-1' }),
      experimentFabricator.attributesBasic({ name: 'experiment-2' })
    ];

    this.auth0ab = new Auth0AB({ experiments: this.experimentsAttrs });

    this.integration = new Auth0MetricsIntegration({ auth0ab: this.auth0ab });
  });

  after(function() {
    delete global.Auth0Metrics;
  });

  describe('#start', function() {
    beforeEach(function() {
      this.configureStub = sinon.stub(this.auth0ab, 'configure');

      this.integration.start(this.startingData);
    });

    it('configures auth0ab to use Auth0MetricsAnalyticsService as analytic service', function() {
      expect(this.configureStub.getCall(0).args[0].analytics).to.be.an.instanceOf(Auth0MetricsAnalyticsService);
    });
  });

  describe('#getMetrics', function() {

    describe('before starting integration', function() {

      it('throws an exception', function() {
        expect(_.bind(function() {
          this.integration.getMetrics();
        }, this)).to.throw();
      });
    });

    describe('after starting integration', function() {
      beforeEach(function() {
        this.integration.start(this.startingData);

        return this.auth0ab.start();
      });

      it('returns the instance of metrics', function() {
        expect(this.integration.getMetrics()).to.be.an.instanceOf(Auth0Metrics);
      });
    });
  });
});
