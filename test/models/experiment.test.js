var expect = require('chai').expect;
var Experiment = require('../../lib/models/experiment');
var _ = require('lodash');
var experimentFabricator = require('../fabricators/experiment_fabricator');

describe('Experiment', function() {

  beforeEach(function() {
    this.experimentData = experimentFabricator.attributesBasic();

    this.experiment = experimentFabricator.fabricateBasic(this.experimentData);
    this.variants = this.experiment.variants;
  });

  describe('.parse', function() {

    describe('when data is valid', function() {
      beforeEach(function() {
        this.result = Experiment.parse(this.experimentData);
      });

      it('returns an experiment according to data', function() {
        expect(this.result.name).to.equal(this.experimentData.name);
      });

      it('return an experiment that has all provided variants', function() {
        this.experimentData.variants.forEach(function(variant) {
          expect(this.result.findVariant(variant.name)).not.to.be.null;
        }, this);
      });
    });

    describe('when there is not name', function() {
      beforeEach(function() {
        delete this.experimentData.name;
      });

      it('throws an exception', function() {
        expect(function() {
          this.result = Experiment.parse(this.experimentData);
        }).to.throw();
      });
    });
  });

  describe('#getCurrentVariant', function() {

    describe('when no variant is selected', function() {
      beforeEach(function() {
        this.result = this.experiment.getCurrentVariant();
      });

      it('returns null', function() {
        expect(this.result).to.be.null
      });
    });

    describe('when a variant is selected', function() {
      beforeEach(function() {
        this.experiment.setCurrentVariantByName(this.experimentData.variants[0].name);
        this.result = this.experiment.getCurrentVariant();
      });

      it('returns the variant', function() {
        expect(this.result.name).to.equal(this.experimentData.variants[0].name);
      });
    });
  });

  describe('#setCurrentVariantByName', function() {

    beforeEach(function() {
      this.experiment.setCurrentVariantByName(this.experimentData.variants[0].name);
    });

    describe('when name does not belong to any of the variants', function() {

      beforeEach(function() {
        try {
          this.experiment.setCurrentVariantByName('not-a-valid-name');
        } catch(e) {
          // Let's ignore the error we will test for it as part of the assertions
        }
      });

      it('throws an exception', function() {
        expect(_.bind(function() {
          this.experiment.setCurrentVariantByName('not-a-valid-name');
        }, this)).to.throw();
      });

      it('does not change current variant', function() {
        expect(this.experiment.getCurrentVariant().name).to.equal(this.experimentData.variants[0].name);
      });
    });

    describe('when name belong to some variant', function() {
      it('sets correct variant as current', function() {
        expect(this.experiment.getCurrentVariant().name).to.equal(this.experimentData.variants[0].name);
      });
    });

  });

  describe('#findVariant', function() {

    describe('when variant with the given name exists', function() {

      beforeEach(function() {
        this.result = this.experiment.findVariant(this.experimentData.variants[0].name);
      });

      it('returns the variant', function() {
        expect(this.result.name).to.equal(this.experimentData.variants[0].name);
      });
    });

    describe('when there is not variant with the given name', function() {

      beforeEach(function() {
        this.result = this.experiment.findVariant('not-a-valid-name');
      });

      it('returns undefined', function() {
        expect(this.result).to.be.undefined;
      });

      it('does not throw', function() {
        expect(_.bind(function() {
          this.experiment.findVariant('not-a-valid-name');
        }, this)).not.to.throw();
      });
    });
  });

  describe('#select', function() {

    beforeEach(function() {
      this.result = this.experiment.select();
    });

    it('returns a random variant', function() {
      expect(this.variants.variants).to.include(this.result);
    });

  });

  describe('#run', function() {

    describe('when there is not a current variant', function() {

      beforeEach(function() {
        this.result = this.experiment.run();
      });

      it('returns a variant', function() {
        expect(this.variants.variants).to.include(this.result);
      });

      it('sets that variant as current', function() {
        expect(this.experiment.getCurrentVariant()).to.equal(this.result);
      });
    });

    describe('when there is a current variant', function() {
      beforeEach(function() {
        this.experiment.setCurrentVariantByName(this.experimentData.variants[0].name);
        this.result = this.experiment.run();
      });

      it('returns current variant', function() {
        expect(this.result).to.equal(this.experiment.getCurrentVariant());
      });
    });
  });
});
