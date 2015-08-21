var expect = require('chai').expect;
var VariantProperties = require('../../lib/models/variant_properties');
var RawVariantProperty = require('../../lib/models/raw_variant_property');
var JsVariantProperty = require('../../lib/models/js_variant_property');
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

      it('creates a raw variant property', function() {
        expect(this.result.variantProperties[0]).to.be.an.instanceOf(RawVariantProperty);
        expect(this.result.variantProperties[1]).to.be.an.instanceOf(RawVariantProperty);
      });

      it('sets the primitive as value', function() {
        expect(this.result.variantProperties[0].getValue()).to.equal('value');
        expect(this.result.variantProperties[1].getValue()).to.equal(44);
      });
    });

    describe('when value is provided as an object', function() {
      beforeEach(function() {
        this.body = 'alert("hello" + name + "!");';
        this.args = ['name']

        this.result = VariantProperties.parse({
          variantProperties: {
            'p1': { body: this.body, args: this.args, type: 'js' },
            'p2': 44
          }
        });
      });

      it('contains all properties', function() {
        expect(this.result.variantProperties.length).to.equal(2);
      });

      it('create instances according to the provided type', function() {
        expect(this.result.variantProperties[0]).to.be.an.instanceOf(JsVariantProperty);
        expect(this.result.variantProperties[1]).to.be.an.instanceOf(RawVariantProperty);
      });
    });


    describe('when type is invalid for some property', function() {

      it('throws an exception', function() {
        expect(function() {
          VariantProperties.parse({
            variantProperties: {
              'p1': { type: 'not-valid' },
              'p2': 44
            }
          });
        }).to.throw();
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
