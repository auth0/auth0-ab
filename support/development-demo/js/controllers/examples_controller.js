(function() {
  "use strict";

  function ExamplesController() {
    this.$container = $('.js-main-container');
  }

  ExamplesController.prototype.showPageJSMiddleware = function(ctx) {
    var experiment1 = ctx.experiments.findByName('experiment-1').getCurrentVariant();

    this.$container.find('.js-title').text(experiment1.getProperty('title').getValue());
    this.$container.find('.js-description').text('Find configuration on file --> ab.js');
  };

  Auth0ABExamples.controllers.ExamplesController = ExamplesController;

})();
