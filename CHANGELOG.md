## [1.0.2] - 2017-05-10

### Fixed

- [] Update zuul-ngrok (`Ramiro Silveyra d'Avila`)
  https://github.com/auth0/metrics/commit/569e5821cef78d11e3b9895c81c46bcbfb576fa4
- [] Update cdn release process (`Ramiro Silveyra d'Avila`)
  https://github.com/auth0/metrics/commit/fc09cb6f7e0d9f9cc18aa3e467a9cc0eb71720d4
- [] Update package.json (`Cristian Douce`)
  https://github.com/auth0/metrics/commit/cd86c13b9f6b992a70304758463bd0932b8878a5
- [] Update README.md (`Cristian Douce`)
  https://github.com/auth0/metrics/commit/bed595127a21fa4ef2e8245a36937052c2e22cb1

## [1.0.1] - 2015-09-11

### Fixed
- Added call to metricsLib.track
- Replaced `metricsLib.segment.identify` with `metricsLib.identify`


## [1.0.0] - 2015-09-04

### Fixed
- Added `path` property to experiments.
- Added support to run experiments by path.
- Fixed `grunt` tasks.
- Added `char inception` test.
- Fixed broken tests.
- Replaced `mocha` test harness with `zuul --local`.
- Added `loader` script (along with minify tasks).
- Fixed CDN purge tasks.
