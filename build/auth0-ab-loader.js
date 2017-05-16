!function(){
  var abTestingLib = window.abTestingLib = window.abTestingLib || [];
  // A list of the methods in metrics.js to stub.
  abTestingLib.methods = [];
  abTestingLib.factory = function(method){
    return function(){
      var args = Array.prototype.slice.call(arguments);
      args.unshift(method);
      abTestingLib.push(args);
      return abTestingLib;
    };
  };
  for (var i = 0; i < abTestingLib.methods.length; i++) {
    var key = abTestingLib.methods[i];
    abTestingLib[key] = abTestingLib.factory(key);
  }
  abTestingLib.load = loader;

  function loader(config) {

    if(null != window.Auth0AB){
      window.abTestingLib = new Auth0AB(config);
      return;
    }

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = ('https:' === document.location.protocol
      ? 'https://' : 'http://')
      + 'cdn.auth0.com/js/ab/1.0.3/auth0-ab.min.js';
    script.onerror = function(){
      console.error('abTestingLib couldn&#39;t be loaded.');
    }
    script.onload = function(){
      // Grab analytics and make it private
      window.abTestingLib = new Auth0AB(config);
    }
    var first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(script, first);
  };
}();
