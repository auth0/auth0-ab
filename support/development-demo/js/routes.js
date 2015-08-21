(function() {
  "use strict";

  var abMiddleware = Auth0ABExamples.auth0ab.integration('pagejs').middleware();
  var examplesController = new Auth0ABExamples.controllers.ExamplesController();

  page('/examples/page-mw', abMiddleware, examplesController.showPageJSMiddleware.bind(examplesController));
  page('/examples/page-mw-with-js', abMiddleware, examplesController.showPageJSMiddlewareWithJS.bind(examplesController));
  page();

})();
