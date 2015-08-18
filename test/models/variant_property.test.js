var expect = require('chai').expect;
var VariantProperty = require('../../lib/models/variant_property');
var variantPropertyFabricator = require('../fabricators/variant_property_fabricator');
var _ = require('lodash');

describe('VariantProperty', function() {

  beforeEach(function() {
    this.variantPropertyData = variantPropertyFabricator.attributesBasic();

    this.property = variantPropertyFabricator.fabricateBasic(this.variantPropertyData);
  });

  describe('.parse', function() {

    describe('when all data is provided', function() {
      beforeEach(function() {
        this.result = VariantProperty.parse(this.variantPropertyData);
      });

      it('has correct name', function() {
        expect(this.result.name).to.equal(this.variantPropertyData.name);
      });

      it('has correct type', function() {
        expect(this.result.getType()).to.equal(this.variantPropertyData.type);
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
        expect(_.bind(VariantProperty.parse, VariantProperty, this.variantPropertyData)).to.throw();
      });
    });

    describe('when type is not provided', function() {

      beforeEach(function() {
        delete this.variantPropertyData.type;
      });

      it('throws an exception', function() {
        expect(_.bind(VariantProperty.parse, VariantProperty, this.variantPropertyData)).to.throw();
      });
    });

    describe('when type is invalid', function() {

      beforeEach(function() {
        this.variantPropertyData.type = 'not-valid';
      });

      it('throws an exception', function() {
        expect(_.bind(VariantProperty.parse, VariantProperty, this.variantPropertyData)).to.throw();
      });
    });
  });

  describe('#runInContext', function() {

    describe('when type is not js', function() {

      it('throws an exception', function() {
        expect(_.bind(this.property.runInContext, this.property, 'test')).to.throw();
      });
    });

    // TODO Remove comment once it is implemented
    xdescribe('when type is js', function() {

      beforeEach(function() {
        var variantProperty = new VariantProperty({
          name: 'p1',
          type: 'js',
          value: 'function(obj) { obj.callCount += 1; }'
        });

        this.context = { callCount: 0 };
        this.property.runInContext(this.context);
      });

      it('it runs the js', function() {
        expect(this.context.callCount).to.equal(1);
      });
    });
  });

});
