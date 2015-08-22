var expect = require('chai').expect;
var Experiment = require('../../lib/models/experiment');
var Experiments = require('../../lib/models/experiments');
var variantFabricator = require('../fabricators/variant_fabricator');
var _ = require('lodash');
var sinon = require('sinon');


function sharedExamplesForRunAll() {
  it('runs the specified experiments', function() {
    this.expectedRun.forEach(function(experiment){
      expect(experiment.run.called).to.equal(true);
    }, this);
    this.expectedNotRun.forEach(function(experiment){
      expect(experiment.run.called).to.equal(false);
    }, this);
  });

  it('returns experiments collection containing only the ones that have been run', function() {
    this.expectedRun.forEach(function(experiment){
      expect(this.result.findByName(experiment.name)).to.equal(experiment);
    }, this);
    this.expectedNotRun.forEach(function(experiment){
      expect(this.result.findByName(experiment.name)).to.equal(undefined);
    }, this);
  });
}

describe('Experiments', function() {

  beforeEach(function() {
    this.experimentsData = [
      {
        name: 'experiment-1',
        variants: [
          variantFabricator.attributesBasic({ name: 'e1-variant-1' }),
          variantFabricator.attributesBasic({ name: 'e1-variant-2' })
        ]
      },
      {
        name: 'experiment-2',
        variants: [
          variantFabricator.attributesBasic({ name: 'e2-variant-1' }),
          variantFabricator.attributesBasic({ name: 'e2-variant-2' })
        ]
      },
      {
        name: 'experiment-3',
        variants: [
          variantFabricator.attributesBasic({ name: 'e3-variant-1' }),
          variantFabricator.attributesBasic({ name: 'e3-variant-2' })
        ]
      }
    ];

    this.experimentsArray = [
      Experiment.parse(this.experimentsData[0]),
      Experiment.parse(this.experimentsData[1]),
      Experiment.parse(this.experimentsData[2])
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
      expect(this.result.experiments[2].name).to.equal('experiment-3')
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

    describe('#findAllByName', function() {

      beforeEach(function() {
        this.experimentNames = ['experiment-1', 'experiment-3'];
        this.excluded = [ 'experiment-2' ];
        this.result = this.experimentsCollection.findAllByName(this.experimentNames);
      });

      it('returns a new experiments collection with the requested experiments', function() {
        this.experimentNames.forEach(function(name) {
          expect(this.result.findByName(name)).to.equal(this.experimentsCollection.findByName(name));
        }, this);
      });

      it('does not include not requested experiment', function() {
        this.excluded.forEach(function(name) {
          expect(this.result.findByName(name)).to.equal(undefined);
        }, this);
      });
    });

    describe('#runAll', function() {

      beforeEach(function() {
        this.experimentsArray.forEach(function(experiment) {
          sinon.stub(experiment, 'run');
        });
      });

      describe('when runnables are specified', function() {

        beforeEach(function() {
          this.expectedRun = [this.experimentsArray[0], this.experimentsArray[2]];
          this.expectedNotRun = [this.experimentsArray[1]];
          this.runnables = ['experiment-3', 'experiment-1'];
          this.result = this.experimentsCollection.runAll(this.runnables);
        });

        sharedExamplesForRunAll();
      });

      describe('when runnable are not specified', function() {
        beforeEach(function() {
          this.expectedRun = [ this.experimentsArray[0], this.experimentsArray[2], this.experimentsArray[1] ];
          this.expectedNotRun = [];
          this.result = this.experimentsCollection.runAll();
        });

        sharedExamplesForRunAll();
      });
    });
  });

  describe('#setCurrentVariantsByName', function() {

    beforeEach(function() {
      this.selectedVariants = {
        'experiment-1': 'e1-variant-1',
        'experiment-2': 'e2-variant-2'
      };

      this.experimentsCollection.setCurrentVariantsByName(this.selectedVariants)
    });

    it('sets variants for provided experiments', function() {
      expect(this.experimentsCollection.findByName('experiment-1').getCurrentVariant().name).to.equal('e1-variant-1');
      expect(this.experimentsCollection.findByName('experiment-2').getCurrentVariant().name).to.equal('e2-variant-2');
    });

    it('does not set variants for non-provided experiments', function() {
      expect(this.experimentsCollection.findByName('experiment-3').getCurrentVariant()).to.be.null;
    });

  });

  describe('#toPlainObject', function() {

    beforeEach(function() {
      this.result = this.experimentsCollection.toPlainObject();
    });

    it('returns an array of experiments', function() {
      this.result.forEach(function(plainExperiment, index) {
        expect(plainExperiment.name).to.equal(this.experimentsData[index].name)
      }, this);
    });
  });
});
