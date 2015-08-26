var expect = require('chai').expect;
var RawVariantProperty = require('../../lib/models/raw_variant_property');
var variantPropertyFabricator = require('../fabricators/variant_property_fabricator');
var _ = require('lodash');

describe('RawVariantProperty', function() {

  beforeEach(function() {
    this.variantPropertyData = variantPropertyFabricator.attributesBasic();

    this.property = variantPropertyFabricator.fabricateBasic(this.variantPropertyData);
  });

  describe('.parse', function() {

    describe('when all data is provided', function() {
      beforeEach(function() {
        this.result = RawVariantProperty.parse(this.variantPropertyData);
      });

      it('has correct name', function() {
        expect(this.result.name).to.equal(this.variantPropertyData.name);
      });

      it('has correct value', function() {
        expect(this.result.getValue()).to.equal(this.variantPropertyData.value);
      });
    });

    describe('when name is not provided', function() {

      beforeEach(function() {
        delete this.variantPropertyData.name;
      });

      it('throws an exception', function() {
        expect(_.bind(RawVariantProperty.parse, RawVariantProperty, this.variantPropertyData)).to.throw();
      });
    });
  });

  describe('#getValue', function() {

    it('returns the value', function() {
      expect(this.property.getValue()).to.equal(this.variantPropertyData.value);
    });
  });

  describe('#toPlainObject', function() {

    beforeEach(function() {
      this.result = this.property.toPlainObject();
    });

    it('returns an object with property name', function() {
      expect(this.result).to.have.property('name', this.property.name);
    });

    it('returns an object with property type', function() {
      expect(this.result).to.have.property('type', 'raw');
    });

    it('returns an object with the value', function() {
      expect(this.result).to.have.property('value', this.property.getValue());
    });
  });
});
