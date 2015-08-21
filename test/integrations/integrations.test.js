var expect = require('chai').expect;
var Integrations = require('../../lib/integrations/integrations');
var Experiments = require('../../lib/models/experiments');
var _ = require('lodash');
var experimentFabricator = require('../fabricators/experiment_fabricator');

describe('Integrations', function() {
  beforeEach(function() {
    this.integrations = new Integrations();
  });

  describe('#add', function() {

    describe('when there is not an integration with the same name', function() {
      beforeEach(function() {
        this.integrations.add('example', IntegrationExample);
      });

      it('adds the integration', function() {
        expect(this.integrations.get('example')).to.equal(IntegrationExample);
      });
    });

    describe('when there is an integration with the same name', function() {
      beforeEach(function() {
        this.integrations.add('example', IntegrationExample);
      });

      describe('and when it is also the same class', function() {

        it('does not throw an exception', function() {
          expect(_.bind(function() {
            this.integrations.add('example', IntegrationExample);
          }, this)).not.to.throw();
        });
      });

      describe('and when it is another class', function() {

        it('throws an exception', function() {
          expect(_.bind(function() {
            function AnotherIntegration() {}
            this.integrations.add('example', AnotherIntegration);
          }, this)).to.throw();
        });
      });
    });
  });

  describe('#remove', function() {

    describe('when integration exists', function() {
      beforeEach(function() {
        this.integrations.add('example', IntegrationExample);
        this.integrations.remove('example');
      });

      it('removes the integration', function() {
        expect(this.integrations.get('example')).to.equal(undefined);
      });
    });

    describe('when integration does not exist', function() {

      it('does not throw an exception', function() {
        expect(_.bind(function() {
          this.integrations.remove('not-existing-integration');
        }, this)).not.to.throw();
      });
    });
  });

  describe('#get', function() {

    describe('when the integration exist', function() {
      beforeEach(function() {
        this.integrations.add('example', IntegrationExample);
        this.result = this.integrations.get('example');
      });

      it('returns the integration', function() {
        expect(this.result).to.equal(IntegrationExample);
      });
    });

    describe('when the integration does not exist', function() {
      beforeEach(function() {
        this.result = this.integrations.get('not-existing-integration');
      });

      it('returns undefined', function() {
        expect(this.result).to.be.undefined;
      });
    });
  });

  describe('#build', function() {
    beforeEach(function() {
      this.experiments = new Experiments();
    });

    describe('when integration is defined', function() {
      beforeEach(function() {
        this.integrations.add('example', IntegrationExample);
        this.built = this.integrations.build('example', this.experiments);
      });

      it('returns an instance of the integration', function() {
        expect(this.built).to.be.an.instanceOf(IntegrationExample);
      });

    });

    describe('when integration is not defined', function() {

      it('throws an exception', function() {
        expect(_.bind(function() {
          this.integrations.build('not-existing-integration', this.experiments)
        }, this)).to.throw();
      });
    });

  });
});

function IntegrationExample() {}
