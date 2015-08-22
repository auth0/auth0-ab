(function() {
  "use strict";


  function ExperimentsExampleView(options) {
    this.$container = $('.js-main-container');

    this.title = options.title;
    this.experiments = options.experiments;
  }

  ExperimentsExampleView.prototype.render = function() {
    this.$container.find('.js-title').text(this.title);
    this.$container.find('.js-description').text('Library status');
    this.$container.find('.js-code').text(JSON.stringify(this.experiments.toPlainObject(), null, 2));
  };

  Auth0ABExamples.views.ExperimentsExampleView = ExperimentsExampleView;

})();
