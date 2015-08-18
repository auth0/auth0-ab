var expect = require('chai').expect;
var Experiment = require('../../lib/models/experiment');
var Experiments = require('../../lib/models/experiments');
var _ = require('lodash');

describe('Experiments', function() {

  beforeEach(function() {
    this.experimentsData = [
      {
        name: 'experiment-1',
        variants: []
      },
      {
        name: 'experiment-2',
        variants: []
      }
    ];

    this.experimentsArray = [
      new Experiment(this.experimentsData[0]),
      new Experiment(this.experimentsData[1])
    ];

    this.experimentsCollection = new Experiments({ experiments: this.experimentsArray });
  });

  describe('.parse', function() {

    beforeEach(function() {
      this.result = Experiments.parse({ experiments: this.experimentsData });
    });

    it('contains all the experiments', function() {
      expect(this.result.experiments[0].name).to.equal('experiment-1')
      expect(this.result.experiments[1].name).to.equal('experiment-2')
    });
  });

  describe('#findByName', function() {

    describe('when experiment name exists', function() {
      beforeEach(function() {
        this.result = this.experimentsCollection.findByName('experiment-2');
      });

      it('returns the experiment', function() {
        expect(this.result).to.equal(this.experimentsArray[1]);
      });

    });

    describe('when experiment name does not exist', function() {

      beforeEach(function() {
        this.result = this.experimentsCollection.findByName('not-a-valid-name');
      });

      it('returns undefined', function() {
        expect(this.result).to.be.undefined;
      });

      it('does not throw', function() {
        expect(_.bind(function() {
          this.experimentsCollection.findByName('not-a-valid-name');
        }, this)).not.to.throw();
      });
    });

  });

});
