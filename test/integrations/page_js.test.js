var expect = require('chai').expect;
var Auth0AB = require('../../lib/auth0_ab');
var PageJS = require('../../lib/integrations/page_js');
var _ = require('lodash');
var experimentFabricator = require('../fabricators/experiment_fabricator');

function sharedExamplesForMiddleware(all) {

  it('adds a collection with ' + (all ? 'all' : 'the specified') + ' experiments on the context', function() {
    expect(this.context).to.have.property('experiments');

    this.expectedExperimens.forEach(function(name){
      expect(this.context.experiments.findByName(name)).to.exist;
    }, this);

    this.notExpectedExperimens.forEach(function(name){
      expect(this.context.experiments.findByName(name)).to.equal(undefined);
    }, this);
  });
}

describe('PageJS', function() {

  beforeEach(function() {
    this.experimentsAttrs = [
      experimentFabricator.attributesBasic({ name: 'experiment-1' }),
      experimentFabricator.attributesBasic({ name: 'experiment-2' })
    ];

    this.auth0ab = new Auth0AB({ experiments: this.experimentsAttrs });
    this.auth0ab.start();

    this.integration = new PageJS({ auth0ab: this.auth0ab });
  });

  describe('#middleware', function() {

    describe('when it is called without parameters', function() {
      beforeEach(function(done) {
        this.expectedExperimens = ['experiment-1', 'experiment-2'];
        this.notExpectedExperimens = []
        this.middleware = this.integration.middleware();

        this.context = {};
        this.middleware(this.context, done);
      });

      sharedExamplesForMiddleware(true);
    });

    describe('when middleware is called with some experiments', function(all) {
      beforeEach(function(done) {
        this.expectedExperimens = [ 'experiment-1' ]
        this.notExpectedExperimens = [ 'experiment-2' ]
        this.middleware = this.integration.middleware([
          'experiment-1'
        ]);

        this.context = {};
        this.middleware(this.context, done);
      });

      sharedExamplesForMiddleware(false);
    });
  });
});
