var path = require('path');
var pkg = require('./package');

var minor_version = pkg.version.replace(/\.(\d)*$/, '');
var major_version = pkg.version.replace(/\.(\d)*\.(\d)*$/, '');
var path = require('path');

function  rename_release (v) {
  return function (d, f) {
    var dest = path.join(d, f.replace(/(\.min)?\.js$/, '-'+ v + '$1.js').replace('auth0-', ''));
    return dest;
  };
}

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
    copy: {
      release: {
        files: [
          { expand: true, flatten: true, src: 'build/*', dest: 'release/', rename: rename_release(pkg.version) },
          { expand: true, flatten: true, src: 'build/*', dest: 'release/', rename: rename_release(minor_version) },
          { expand: true, flatten: true, src: 'build/*', dest: 'release/', rename: rename_release(major_version) }
        ]
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
    aws_s3: {
      options: {
        accessKeyId:     process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET,
        bucket:          process.env.S3_BUCKET,
        region:          process.env.S3_REGION,
        uploadConcurrency: 5,
        params: {
          CacheControl: 'public, max-age=300'
        },
        // debug: true <<< use this option to test changes
      },
      clean: {
        files: [
          { action: 'delete', dest: 'js/ab/ab-' + pkg.version + '.js' },
          { action: 'delete', dest: 'js/ab/ab-' + pkg.version + '.min.js' },
          { action: 'delete', dest: 'js/ab/ab-' + major_version + '.js' },
          { action: 'delete', dest: 'js/ab/ab-' + major_version + '.min.js' },
          { action: 'delete', dest: 'js/ab/ab-' + minor_version + '.js' },
          { action: 'delete', dest: 'js/ab/ab-' + minor_version + '.min.js' },
          { action: 'delete', dest: 'js/ab/ab-loader-' + pkg.version + '.min.js' },
          { action: 'delete', dest: 'js/ab/ab-loader-' + major_version + '.min.js' },
          { action: 'delete', dest: 'js/ab/ab-loader-' + minor_version + '.min.js' },
          { action: 'delete', dest: 'js/ab/ab-loader-' + pkg.version + '.js' },
          { action: 'delete', dest: 'js/ab/ab-loader-' + major_version + '.js' },
          { action: 'delete', dest: 'js/ab/ab-loader-' + minor_version + '.js' }
        ]
      },
      publish: {
        files: [
          {
            expand: true,
            cwd:    'release/',
            src:    ['**'],
            dest:   'js/ab/'
          }
        ]
      }
    },
    http: {
      purge_js: {
        options: {
          url: process.env.CDN_ROOT + '/js/ab/ab-' + pkg.version + '.js',
          method: 'DELETE'
        }
      },
      purge_js_min: {
        options: {
          url: process.env.CDN_ROOT + '/js/ab/ab-' + pkg.version + '.min.js',
          method: 'DELETE'
        }
      },
      purge_major_js: {
        options: {
          url: process.env.CDN_ROOT + '/js/ab/ab-' + major_version + '.js',
          method: 'DELETE'
        }
      },
      purge_major_js_min: {
        options: {
          url: process.env.CDN_ROOT + '/js/ab/ab-' + major_version + '.min.js',
          method: 'DELETE'
        }
      },
      purge_minor_js: {
        options: {
          url: process.env.CDN_ROOT + '/js/ab/ab-' + minor_version + '.js',
          method: 'DELETE'
        }
      },
      purge_minor_js_min: {
        options: {
          url: process.env.CDN_ROOT + '/js/ab/ab-' + minor_version + '.min.js',
          method: 'DELETE'
        }
      },
      purge_loader_js: {
        options: {
          url: process.env.CDN_ROOT + '/js/ab/ab-loader-' + pkg.version + '.js',
          method: 'DELETE'
        }
      },
      purge_loader_major_js: {
        options: {
          url: process.env.CDN_ROOT + '/js/ab/ab-loader-' + major_version + '.js',
          method: 'DELETE'
        }
      },
      purge_loader_minor_js: {
        options: {
          url: process.env.CDN_ROOT + '/js/ab/ab-loader-' + minor_version + '.js',
          method: 'DELETE'
        }
      },
      purge_loader_js_min: {
        options: {
          url: process.env.CDN_ROOT + '/js/ab/ab-loader-' + pkg.version + '.min.js',
          method: 'DELETE'
        }
      },
      purge_loader_major_js_min: {
        options: {
          url: process.env.CDN_ROOT + '/js/ab/ab-loader-' + major_version + '.min.js',
          method: 'DELETE'
        }
      },
      purge_loader_minor_js_min: {
        options: {
          url: process.env.CDN_ROOT + '/js/ab/ab-loader-' + minor_version + '.min.js',
          method: 'DELETE'
        }
      }
    },
    jsdoc: {
      dist : {
        src: ['lib/**/*.js'],
        options: {
          destination: 'build',
          template : 'support/loader',
          query: 'majorFileName=ab-' + major_version
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

  grunt.registerTask('purge_cdn',     ['http:purge_js', 'http:purge_js_min', 'http:purge_major_js', 'http:purge_major_js_min', 'http:purge_minor_js', 'http:purge_minor_js_min', 'http:purge_loader_js', 'http:purge_loader_major_js', 'http:purge_loader_minor_js', 'http:purge_loader_js_min', 'http:purge_loader_major_js_min', 'http:purge_loader_minor_js_min']);

  grunt.registerTask('cdn',           ['build', 'copy:release', 'aws_s3:clean', 'aws_s3:publish', 'purge_cdn']);
};
