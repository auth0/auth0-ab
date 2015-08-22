(function() {
  "use strict";

  function VariantExampleView(options) {
    this.$container = $('.js-main-container');

    this.variant = options.variant;
  }

  VariantExampleView.prototype.render = function() {
    this.$container.find('.js-title').text(this.variant.getProperty('title').getValue());
    this.$container.find('.js-description').text('Find configuration on file --> ab.js');
    this.$container.find('.js-code').text(JSON.stringify(this.variant.toPlainObject(), null, 2));
  };

  VariantExampleView.prototype.runJS = function() {
    var name = prompt("What's your name?");
    this.variant.getProperty('grettings').runInContext(name)
  };

  Auth0ABExamples.views.VariantExampleView = VariantExampleView;

})();
