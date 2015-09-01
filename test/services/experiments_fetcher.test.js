var expect = require('chai').expect;
var ExperimentsFetcher = require('../../lib/services/experiments_fetcher');
var _ = require('lodash');
var experimentFabricator = require('../fabricators/experiment_fabricator');
var BPromise = require('bluebird');

describe('ExperimentsFetcher', function() {

  beforeEach(function() {
    this.experimentsDefinition = [
      experimentFabricator.attributesBasic(),
      experimentFabricator.attributesBasic()
    ];

    this.fetcher = new ExperimentsFetcher({
      fetchFn: _.bind(function() {
        return BPromise.resolve(this.experimentsDefinition);
      }, this)
    });
  });

  describe('#fetch', function() {

    beforeEach(function() {
      return this.fetcher.fetch().then(_.bind(function(experiments) {
        this.result = experiments;
      }, this));
    });

    it('returns fetched experiments', function() {
      expect(this.result.findByName(this.experimentsDefinition[0].name)).not.to.be.undefined;
      expect(this.result.findByName(this.experimentsDefinition[1].name)).not.to.be.undefined;
    });
  });

});
