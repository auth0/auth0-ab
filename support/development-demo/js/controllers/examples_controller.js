(function() {
  "use strict";

  function ExamplesController() {

  }

  ExamplesController.prototype.showPageJSMiddleware = function(ctx) {
    var variantExperiment1 = ctx.experiments.findByName('experiment-1').getCurrentVariant();

    var view = new Auth0ABExamples.views.VariantExampleView({
      variant: variantExperiment1
    });

    view.render();
  };

  ExamplesController.prototype.showPageJSMiddlewareWithJS = function(ctx) {
    var variantExperiment1 = ctx.experiments.findByName('experiment-1').getCurrentVariant();

    var view = new Auth0ABExamples.views.VariantExampleView({
      variant: variantExperiment1
    });

    view.render();
    view.runJS();
  };

  ExamplesController.prototype.showSetCurrentVariants = function(ctx) {
    var auth0abAsync = new Auth0AB({
      fetchFn: function() {
        return $.get('/experiments.json');
      }
    });

    auth0abAsync.fetch().then(function() {
      auth0abAsync.setCurrentVariantsByName({
        'experiment-1': 'variant-1',
        'experiment-2': 'variant-2'
      });

      var view = new Auth0ABExamples.views.ExperimentsExampleView({
        experiments: auth0abAsync.getExperiments(),
        title: 'Variants for experiments'
      });

      view.render();
    }.bind(this));
  };

  Auth0ABExamples.controllers.ExamplesController = ExamplesController;

})();
