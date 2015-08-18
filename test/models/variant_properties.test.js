var expect = require('chai').expect;
var VariantProperties = require('../../lib/models/variant_properties');
var variantPropertyFabricator = require('../fabricators/variant_property_fabricator');
var _ = require('lodash');

describe('VariantProperties', function() {

  beforeEach(function() {
    this.variantPropertiesData = [
      variantPropertyFabricator.attributesBasic(),
      variantPropertyFabricator.attributesBasic()
    ];

    this.variantPropertiesArray = [
      variantPropertyFabricator.fabricateBasic(this.variantPropertiesData[0]),
      variantPropertyFabricator.fabricateBasic(this.variantPropertiesData[1])
    ];

    this.propertiesCollection = new VariantProperties({ variantProperties: this.variantPropertiesArray });
  });

  describe('.parse', function() {

    describe('when value is provided as a primitive', function() {

      beforeEach(function() {
        this.result = VariantProperties.parse({
          variantProperties: {
            'p1': 'value',
            'p2': 44
          }
        });
      });

      it('contains all properties', function() {
        expect(this.result.variantProperties.length).to.equal(2);
      });

      it('sets type as "raw"', function() {
        expect(this.result.variantProperties[0].getType()).to.equal('raw');
        expect(this.result.variantProperties[1].getType()).to.equal('raw');
      });

      it('sets the primitive as value', function() {
        expect(this.result.variantProperties[0].getValue()).to.equal('value');
        expect(this.result.variantProperties[1].getValue()).to.equal(44);
      });
    });

    describe('when value is provided as an object', function() {
      beforeEach(function() {
        this.js = 'function() { alert("hello!"); }';

        this.result = VariantProperties.parse({
          variantProperties: {
            'p1': { value: this.js, type: 'js' },
            'p2': 44
          }
        });
      });

      it('contains all properties', function() {
        expect(this.result.variantProperties.length).to.equal(2);
      });

      it('sets type according to the provided type', function() {
        expect(this.result.variantProperties[0].getType()).to.equal('js');
      });

      it('sets #{object}.value as value', function() {
        expect(this.result.variantProperties[0].getValue()).to.equal(this.js);
      });
    });
  });

  describe('#findByName', function() {

    describe('when property name exist', function() {
      beforeEach(function() {
        this.result = this.propertiesCollection.findByName(this.variantPropertiesData[1].name)
      });

      it('returns the property', function() {
        expect(this.result).to.equal(this.variantPropertiesArray[1]);
      });
    });

    describe('when property name does not exist', function() {
      beforeEach(function() {
        this.result = this.propertiesCollection.findByName('not a valid name')
      });

      it('returns the undefined', function() {
        expect(this.result).to.be.undefined
      });
    });
  });

});
