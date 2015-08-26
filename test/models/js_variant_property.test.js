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

    describe('when body and fn are not provided', function() {

      beforeEach(function() {
        delete this.variantPropertyData.body;
      });

      it('throws an exception', function() {
        expect(_.bind(JsVariantProperty.parse, JsVariantProperty, this.variantPropertyData)).to.throw();
      });
    });
  });

  describe('#runInContext', function() {

    describe('when body is provided as an string', function() {

      beforeEach(function() {
        var variantProperty = new JsVariantProperty.parse({
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

    describe('when body is provided as a function', function() {

      beforeEach(function() {
        var variantProperty = new JsVariantProperty.parse({
          name: 'p1',
          type: 'js',
          fn: function(obj) { obj.callCount += 1; }
        });

        this.context = { callCount: 0 };
        variantProperty.runInContext(this.context);
      });

      it('it runs the js', function() {
        expect(this.context.callCount).to.equal(1);
      });
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
      expect(this.result).to.have.property('type', 'js');
    });

    it('returns an object with the function', function() {
      expect(this.result).to.have.property('fn').and.to.be.a.function;
    });
  });

});
