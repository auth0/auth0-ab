var expect = require('chai').expect;
var JsVariantProperty = require('../../lib/models/js_variant_property');
var variantPropertyFabricator = require('../fabricators/variant_property_fabricator');
var _ = require('lodash');

describe('JsVariantProperty', function() {

  beforeEach(function() {
    this.variantPropertyData = variantPropertyFabricator.attributesJsBasic();

    this.property = variantPropertyFabricator.fabricateJsBasic(this.variantPropertyData);
  });

  describe('.parse', function() {

    describe('when all data is provided', function() {
      beforeEach(function() {
        this.result = JsVariantProperty.parse(this.variantPropertyData);
      });

      it('has correct name', function() {
        expect(this.result.name).to.equal(this.variantPropertyData.name);
      });
    });

    describe('when name is not provided', function() {

      beforeEach(function() {
        delete this.variantPropertyData.name;
      });

      it('throws an exception', function() {
        expect(_.bind(JsVariantProperty.parse, JsVariantProperty, this.variantPropertyData)).to.throw();
      });
    });

    describe('when body is not provided', function() {

      beforeEach(function() {
        delete this.variantPropertyData.body;
      });

      it('throws an exception', function() {
        expect(_.bind(JsVariantProperty.parse, JsVariantProperty, this.variantPropertyData)).to.throw();
      });
    });
  });

  describe('#runInContext', function() {

    describe('when type is js', function() {

      beforeEach(function() {
        var variantProperty = new JsVariantProperty({
          name: 'p1',
          type: 'js',
          args: ['obj'],
          body: 'obj.callCount += 1;'
        });

        this.context = { callCount: 0 };
        variantProperty.runInContext(this.context);
      });

      it('it runs the js', function() {
        expect(this.context.callCount).to.equal(1);
      });
    });
  });

});
