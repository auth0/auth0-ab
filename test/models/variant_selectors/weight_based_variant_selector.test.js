
var expect = require('chai').expect;
var WeightBasedVariantSelector = require('../../../lib/models/variant_selectors/weight_based_variant_selector');
var variantFabricator = require('../../fabricators/variant_fabricator');
var _ = require('lodash');

describe('WeightBasedVariantSelector', function() {

  beforeEach(function() {
    this.variants = [
      variantFabricator.fabricateBasic({ settings: { weight: 1 } }),
      variantFabricator.fabricateBasic({ settings: { weight: 1.5 } }),
      variantFabricator.fabricateBasic({ settings: { weight: 2 } })
    ];

    this.selector = new WeightBasedVariantSelector(this.variants);
  });

  describe('#select', function() {

    describe('when random value is between [0, 1 / sum(weights))', function() {
      beforeEach(function() {
        this.selector._getRandom = function() { return 0.1; };

        this.result = this.selector.select();
      });

      it('selects the first variant', function() {
        expect(this.result).to.equal(this.variants[0]);
      });
    });

    describe('when random value is between [1 / sum(weights), 1.5 / sum(weights) + 1 / sum(weights))', function() {
      beforeEach(function() {
        this.selector._getRandom = function() { return 0.4; };

        this.result = this.selector.select();
      });

      it('selects the second variant', function() {
        expect(this.result).to.equal(this.variants[1]);
      });
    });

    describe('when random value is between [(1.5 + 1) / sum(weights), (2  + 1 + 1.5) / sum(weights)) = [(1.5 + 1) / sum(weights), 1]', function() {
      beforeEach(function() {
        this.selector._getRandom = function() { return 0.6; };

        this.result = this.selector.select();
      });

      it('selects the third variant', function() {
        expect(this.result).to.equal(this.variants[2]);
      });
    });
  });

});
