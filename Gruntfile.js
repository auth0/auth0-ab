var path = require('path');
var pkg = require('./package');

function node_bin (bin) {
  return path.join('node_modules', '.bin', bin);
}

function spaMiddleware(connect, options, middlewares) {
  var modRewrite = require('connect-modrewrite');

  // enable Angular's HTML5 mode
  middlewares.unshift(modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png$ /index.html [L]']));

  return middlewares;
}

module.exports = function (grunt) {
  grunt.initConfig({
    connect: {
      test: {
        options: {
          // base: 'test',
          hostname: '*',
          base: ['.', 'support/development-demo', 'support/development-demo/build', 'build'],
          port: 9999,
          middleware: spaMiddleware
        }
      }
    },
    browserify: {
      options: {
        browserifyOptions: {
          debug: true
        },
        watch: true,

        // Convert absolute sourcemap filepaths to relative ones using mold-source-map.
        postBundleCB: function(err, src, cb) {
          if (err) { return cb(err); }
          var through = require('through');
          var stream = through().pause().queue(src).end();
          var buffer = '';

          stream.pipe(require('mold-source-map').transformSourcesRelativeTo(__dirname)).pipe(through(function(chunk) {
            buffer += chunk.toString();
          }, function() {
            cb(err, buffer);
          }));
          stream.resume();
        }

      },
      debug: {
        files: {
          'build/auth0-ab.js': ['standalone.js']
        }
      },
    },
    less: {
      demo: {
        files: {
          'support/development-demo/build/index.css': 'support/development-demo/index.less'
        }
      }
    },
    exec: {
      'uglify': {
        cmd: node_bin('uglifyjs') + ' build/auth0-ab.js  -b beautify=false,ascii_only=true > build/auth0-ab.min.js',
        stdout: true,
        stderr: true
      },
      'uglify-loader': {
        cmd: node_bin('uglifyjs') + ' build/auth0-ab-loader.js  -b beautify=false,ascii_only=true > build/auth0-ab-loader.min.js',
        stdout: true,
        stderr: true
      },
      'test-inception': {
        cmd: node_bin('mocha') + ' ./test/support/characters-inception.test.js',
        stdout: true,
        stderr: true
      },
      'test-saucelabs': {
        cmd: node_bin('zuul') + ' -- test/**/*.test.js',
        stdout: true,
        stderr: true
      },
      'test-phantom': {
        cmd: node_bin('zuul') + ' --ui mocha-bdd --disable-tunnel --phantom 9999 -- test/**/*.test.js',
        stdout: true,
        stderr: true
      },
      'test-local': {
        cmd: node_bin('zuul') + ' --ui mocha-bdd --disable-tunnel --local 9999 -- test/**/*.test.js',
        stdout: true,
        stderr: true
      },
      cdn: {
        cmd: node_bin('ccu'),
        stdout: true,
        stderr: true
      }
    },
    clean: {
      js: ['release/', 'build/', 'support/development-demo/auth0-ab.js']
    },
    watch: {
      js: {
        files: ['build/auth0-ab.js'],
        tasks: [],
        options: {
          livereload: true
        },
      },
      demo: {
        files: ['support/development-demo/*'],
        tasks: ['less:demo'],
        options: {
          livereload: true
        },
      }
    },
    jsdoc: {
      dist : {
        src: ['lib/**/*.js'],
        options: {
          destination: 'build',
          template : 'support/loader',
          query: 'version=' + pkg.version
        }
      }
    }
  });

  // Loading dependencies
  for (var key in grunt.file.readJSON('package.json').devDependencies) {
    if (key !== 'grunt' && key.indexOf('grunt') === 0) { grunt.loadNpmTasks(key); }
  }

  grunt.registerTask('uglify',        ['exec:uglify', 'exec:uglify-loader']);
  grunt.registerTask('js',            ['clean:js', 'browserify:debug', 'jsdoc']);
  grunt.registerTask('build',         ['js', 'uglify']);

  grunt.registerTask('dev',           ['connect:test', 'less:demo', 'build', 'watch']);

  grunt.registerTask('saucelabs',     ['build', 'exec:test-inception', 'exec:test-saucelabs']);
  grunt.registerTask('phantom',       ['build', 'exec:test-inception', 'exec:test-phantom']);
  grunt.registerTask('local',         ['build', 'exec:test-inception', 'exec:test-local']);

  grunt.registerTask('cdn',           ['build', 'exec:cdn']);
};
