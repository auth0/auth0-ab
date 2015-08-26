(function() {
  "use strict";

  var abMiddleware = Auth0ABExamples.auth0ab.integration('pagejs').middleware();
  var abAsyncMiddleware = Auth0ABExamples.auth0Async.integration('pagejs').middleware();
  var abAsyncMetricsMiddleware = Auth0ABExamples.auth0abAsyncMetrics.integration('pagejs').middleware();

  var examplesController = new Auth0ABExamples.controllers.ExamplesController();

  page('/examples/page-mw', abMiddleware, examplesController.showPageJSMiddleware.bind(examplesController));
  page('/examples/page-mw-with-js', abMiddleware, examplesController.showPageJSMiddlewareWithJS.bind(examplesController));

  // Using the middleware working with async data needs the same code as sync data! The only change is in configuration!
  page('/examples/page-mw-async', abAsyncMiddleware, examplesController.showPageJSMiddlewareWithJS.bind(examplesController));

  page('/examples/page-mw-async-metrics', abAsyncMetricsMiddleware, examplesController.showPageJSMiddlewareAndAuth0Metrics.bind(examplesController));

  page('/examples/page-mw-externally-setting-current-variants', examplesController.showSetCurrentVariants.bind(examplesController));

  page();

})();
