var expect = require('chai').expect;
var Auth0AB = require('../../lib/auth0_ab');
var PageJS = require('../../lib/integrations/page_js');
var _ = require('lodash');
var experimentFabricator = require('../fabricators/experiment_fabricator');

function sharedExamplesForMiddleware(all) {

  it('adds a collection with ' + (all ? 'all' : 'the specified') + ' experiments on the context', function() {
    expect(this.context).to.have.property('experiments');

    this.expectedExperimens.forEach(function(experiment){
      expect(this.context.experiments.findByName(experiment.name)).to.equal(experiment);
    }, this);

    this.notExpectedExperimens.forEach(function(experiment){
      expect(this.context.experiments.findByName(experiment.name)).to.equal(undefined);
    }, this);
  });
}

describe('PageJS', function() {

  beforeEach(function() {
    this.experimentsAttrs = [
      experimentFabricator.attributesBasic(),
      experimentFabricator.attributesBasic(),
    ];

    this.auth0ab = new Auth0AB({ experiments: this.experimentsAttrs });
    this.experimentsArray = this.auth0ab.getExperiments().experiments;

    this.integration = new PageJS({ auth0ab: this.auth0ab });
  });

  describe('#middleware', function() {

    describe('when it is called without parameters', function() {
      beforeEach(function(done) {
        this.expectedExperimens = this.experimentsArray;
        this.notExpectedExperimens = []
        this.middleware = this.integration.middleware();

        this.context = {};
        this.middleware(this.context, done);
      });

      sharedExamplesForMiddleware(true);
    });

    describe('when middleware is called with some experiments', function(all) {
      beforeEach(function(done) {
        this.expectedExperimens = [ this.experimentsArray[0] ]
        this.notExpectedExperimens = [ this.experimentsArray[1] ]
        this.middleware = this.integration.middleware([
          this.experimentsArray[0].name
        ]);

        this.context = {};
        this.middleware(this.context, done);
      });

      sharedExamplesForMiddleware(false);
    });
  });
});
