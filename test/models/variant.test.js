var expect = require('chai').expect;
var Variant = require('../../lib/models/variant');
var variantFabricator = require('../fabricators/variant_fabricator');
var _ = require('lodash');

describe('Variant', function() {

  beforeEach(function() {
    this.variantData = variantFabricator.attributesBasic();

    this.variant = variantFabricator.fabricateBasic(this.variantData);
  });

  describe('.parse', function() {

    beforeEach(function() {
      this.result = Variant.parse(this.variantData);
    });

    it('has correct name', function() {
      expect(this.result.name).to.equal(this.variantData.name);
    });

    it('has correct weight', function() {
      expect(this.result.getWeight()).to.equal(this.variantData.settings.weight);
    });

    it('has all properties', function() {
      _.forEach(this.variantData.properties, function(value, name) {
        expect(this.result.getProperty(name)).to.exist;
      }, this);
    })
  });

  describe('#getProperty', function() {

    describe('when property name exists', function() {
      beforeEach(function() {
        this.propertyName = _(this.variantData.properties).keys().value()[0];
        this.result = this.variant.getProperty(this.propertyName);
      });

      it('returns the property', function() {
        expect(this.result.name).to.equal(this.propertyName);
      });

    });

    describe('when property name does not exist', function() {

      beforeEach(function() {
        this.result = this.variant.getProperty('not-a-valid-name');
      });

      it('returns undefined', function() {
        expect(this.result).to.be.undefined;
      });

      it('does not throw', function() {
        expect(_.bind(function() {
          this.variant.getProperty('not-a-valid-name');
        }, this)).not.to.throw();
      });
    });

  });

  describe('#toPlainObject', function() {

    beforeEach(function() {
      this.result = this.variant.toPlainObject();
    });

    it('returns an object with property name', function() {
      expect(this.result).to.have.property('name', this.variant.name);
    });

    it('returns an object with property settings', function() {
      expect(this.result).to.have.property('settings', this.variant.settings);
    });

    it('returns an object with the properties', function() {
      expect(this.result).to.have.property('properties').and.to.eql(this.variant.properties.toPlainObject());
    });
  });

});
