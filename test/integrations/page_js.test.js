var expect = require('chai').expect;
var Experiments = require('../../lib/models/experiments');
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

    this.experimentsArray = [
      experimentFabricator.fabricateBasic(),
      experimentFabricator.fabricateBasic(),
    ];

    this.experimentsCollection = new Experiments({ experiments: this.experimentsArray });
    this.integration = new PageJS({ experiments: this.experimentsCollection });
  });

  describe('#middleware', function() {

    describe('when it is called without parameters', function() {
      beforeEach(function() {
        this.expectedExperimens = this.experimentsArray;
        this.notExpectedExperimens = []
        this.middleware = this.integration.middleware();

        this.context = {};
        this.middleware(this.context, function() {});
      });

      sharedExamplesForMiddleware(true);
    });

    describe('when middleware is called with some experiments', function(all) {
      beforeEach(function() {
        this.expectedExperimens = [ this.experimentsArray[0] ]
        this.notExpectedExperimens = [ this.experimentsArray[1] ]
        this.middleware = this.integration.middleware([
          this.experimentsArray[0].name
        ]);

        this.context = {};
        this.middleware(this.context, function() {});
      });

      sharedExamplesForMiddleware(false);
    });
  });
});
