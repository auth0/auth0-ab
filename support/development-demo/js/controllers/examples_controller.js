(function() {
  "use strict";

  function ExamplesController() {
    this.$container = $('.js-main-container');
  }

  ExamplesController.prototype.showPageJSMiddleware = function(ctx) {
    var experiment1 = ctx.experiments.findByName('experiment-1').getCurrentVariant();

    this._renderBasicForVariant(experiment1);
  };

  ExamplesController.prototype.showPageJSMiddlewareWithJS = function(ctx) {
    var experiment1 = ctx.experiments.findByName('experiment-1').getCurrentVariant();

    this._renderBasicForVariant(experiment1);

    var name = prompt("What's your name?");
    experiment1.getProperty('grettings').runInContext(name)
  };

  ExamplesController.prototype._renderBasicForVariant = function(experiment) {
    this.$container.find('.js-title').text(experiment.getProperty('title').getValue());
    this.$container.find('.js-description').text('Find configuration on file --> ab.js');
  }

  Auth0ABExamples.controllers.ExamplesController = ExamplesController;

})();
