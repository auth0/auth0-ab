# auth0-ab-testing

This library provides a module to execute A/B experiments on the client side. It was created to work together with auth0-metrics but is
generic enough to work with any metrics library.

## Installation

To install the dependencies, execute:

`npm install`


## Usage (local)
To build and run the library locally, you can run
`npm run dev`, that will let you include the library from http://localhost:9999/auth0-ab.js, there is an small demo to test the library in http://localhost:9999/

## Usage (deploy)
To use it, you have to include the script which has been built, it is built with major, minor and fix versions to be able to granularly specify versioning. You can include either the complete or minified version.

For example, for version 1.3.7, the following files will be built:

```
ab-1.js
ab-1.3.js
ab-1.3.7.js
ab-1.min.js
ab-1.3.min.js
ab-1.3.7.min.js
```

## Examples

### Basic set up

```
  var experiments = [
    {
      name: 'experiment-1',
      variants: [
        {
          name: 'variant-1',
          settings: {
            // The 'weight' attribute is used to state the proportion of the
            // population that is going to go under this variant.
            // The higher weight value is, the higher is the probability
            // for an user of being chosen for the variant.
            weight: 0.5
          },
          properties: {
            'grettings': 'function(data) { alert("Hello " + data.name); }'
          }
        },
        ...
      ]
    },
    ...
  ];
```

### Example 1

```
  var ab = new Auth0AB({
    experiments: experiments
  });

  var experiments = ab.getExperiments();
  var experiment = experiments.getByName('experiment-1');

  console.log(experiment.properties);
  console.log(experiment.settings);

  // Selects a variant from the experiment or returns current applicable variant (if any)
  var variant;

  variant = experiment.run();

  // Returns current applicable variant, null if none.
  variant = experiment.currentVariant();

  // WARNING!: This JS will be run with the same privileges as any other JS in your
  // website, it can access cookies, global variables, monkey patch code, etc.
  // It is extremely important to make sure that you can trust the source of it
  //
  // Never execute JS from a source you cannot trust.
  variant.runInContext('grettings', { name: 'Damian' });

  // or

  variant.getProperty('grettings').runInContext({ name: 'Damian' });

```

### Example 2: Fetching experiments from an external source
```
  var ab = new Auth0AB();

  ab.configure({
    fetch: function() {
      // Returns a promise with the experiments
      // Expected result example:
      // [
      //   {
      //     name: 'experiment-1',
      //     variants: [
      //       {
      //         name: 'variant-1',
      //         settings: {
      //           // Weight is used to state the proportion of the population that is going to
      //           // go under this variant. The higher weight, the higher is the probability
      //           // for an user of being choosen for the variant.
      //           weight: 0.5
      //         },
      //         properties: {
      //           'grettings': 'function(data) { alert("Hello " + data.name); }'
      //         }
      //       },
      //       ...
      //     ]
      //   },
      //   ...
      // ];

      return $.get('/experiments');
    }
  });

  ab.fetchExperiments().then(function(experiments) {
    ...
  });
```

### Example 3: Page.js Middleware

```
  var ab = new Auth0AB();

  page('some/route', ab.middleware(experiments), function(ctx, next) {
    var experiment;

    // All experimentos
    var experiments = ctx.experiments;

    // Get one experiment
    experiment = experiments.get('experiment-1');

    // Current experiment
    var currentExperiment = ctx.currentExperiment;

    var html = template({
      experiments: experiments.toJSON(),
      experiment: currentExperiment.toJSON(),
      somethingElse: ...
    });

    return container.render(html);
  });
```
