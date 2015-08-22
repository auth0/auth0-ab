var expect = require('chai').expect;
var variantFabricator = require('../fabricators/variant_fabricator');
var Variants = require('../../lib/models/variants');
var _ = require('lodash');

describe('Variants', function() {

  beforeEach(function() {
    this.variantsData = [
      variantFabricator.attributesBasic(),
      variantFabricator.attributesBasic()
    ];

    this.variantsArray = [
      variantFabricator.fabricateBasic(this.variantsData[0]),
      variantFabricator.fabricateBasic(this.variantsData[1])
    ];

    this.variantsCollection = new Variants({ variants: this.variantsArray });
  });

  describe('.parse', function() {

    beforeEach(function() {
      this.result = Variants.parse({ variants: this.variantsArray });
    });

    it('contains all the variants', function() {
      this.variantsData.forEach(function(variantData, index) {
        expect(this.result.variants[index].name).to.equal(variantData.name)
      }, this);
    });
  });

  describe('#select', function() {

    beforeEach(function() {
      this.result = this.variantsCollection.select();
    });

    it('returns a variant from the list of variants', function() {
      expect(this.variantsArray).to.include(this.result);
    });
  });

  describe('#findByName', function() {

    describe('when variant name exists', function() {
      beforeEach(function() {
        this.result = this.variantsCollection.findByName(this.variantsData[1].name);
      });

      it('returns the experiment', function() {
        expect(this.result).to.equal(this.variantsArray[1]);
      });

    });

    describe('when variant name does not exist', function() {

      beforeEach(function() {
        this.result = this.variantsCollection.findByName('not-a-valid-name');
      });

      it('returns undefined', function() {
        expect(this.result).to.be.undefined;
      });

      it('does not throw', function() {
        expect(_.bind(function() {
          this.variantsCollection.findByName('not-a-valid-name');
        }, this)).not.to.throw();
      });
    });

  });

  describe('#toPlainObject', function() {

    beforeEach(function() {
      this.result = this.variantsCollection.toPlainObject();
    });

    it('returns an array with all properties', function() {
      this.variantsArray.forEach(function(variant, index) {
        expect(this.result[index]).to.eql(variant.toPlainObject());
      }, this);
    });
  });

});
