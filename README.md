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

### CDN

Using our CDN is the preferred solution. Just add the following line in your project's HTML head and you are done.

```html
<script src="https://cdn.auth0.com/js/ab/1.0.2/ab.min.js"></script>
```

## Examples

### Basic set up

```javascript
  var experimentsDef = [
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
            title: 'Hello!',

            // JS Attribute - Explicit function definition (recomended)
            grettings: {
              type: 'js',
              fn: function(data) {
                alert("Hello " + data.name);
              }
            },

            // String function definition (util for server side provisioning)
            ask: {
              type: 'js',
              args: ['question'],
              body: 'return prompt(question);'
            }
          }
        },
        ...
      ]
    },
    ...
  ];
```

### Example 1

```javascript
  var ab = new Auth0AB({
    experiments: experimentsDef
  });

  ab.start();

  ab.onReady(function() {
    var experiments = ab.getExperiments();

    // Get one experiment
    var experiment = experiments.findByName('experiment-1');

    console.log(experiment.properties);
    console.log(experiment.settings);

    // Run all experiments
    experiments.runAll();

    // Run all experiments with names
    experiments.runAll(['experiment-1', ...]);

    // or run an expecific experiment
    // Selects a variant from the experiment or returns current applicable variant (if any)
    var variant = experiment.run();

    // Set current variant on an specific experiment
    experiment.setCurrentVariantByName('variant-1');

    // Set current variant on a set of experiments
    experiments.setCurrentVariantsByName({
      'experiment-1': 'variant-1',
      'experiment-2': 'variant-4',
      // ...
    })

    // Returns current applicable variant, null if none.
    variant = experiment.getCurrentVariant();

    // WARNING!: This JS will be run with the same privileges as any other JS in your
    // website, it can access cookies, global variables, monkey patch code, etc.
    // It is extremely important to make sure that you can trust the source of it
    //
    // Never execute JS from a source you cannot trust.
    variant.getProperty('grettings').runInContext({ name: 'Damian' });

    // Get plain object version of experiments / variants
    experiments.toPlainObject()
    experiment.toPlainObject()
    variant.toPlainObject()
  });
```

### Example 2: Fetching experiments from an external source

```javascript
  var ab = new Auth0AB({
    fetchFn: function() {
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
      //           ...
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

  ab.start();

  ab.onReady(function(ab) {
    var experiments = ab.getExperiments();
    ...
  });
```

### Example 3: Page.js Middleware

```javascript
  var ab = new Auth0AB({
    experiments: experimentsDef
  });
  // or
  ab = new Auth0AB({
    fetchFn: function() { // See example above }
  });

  ab.start();

  page('some/route', ab.integration('pagejs').middleware(/* optional */['experiment-1']), function(ctx, next) {
    // Get variant
    var variantExperiment1 = ctx.experiments.findByName('experiment-1').getCurrentVariant();

    var html = template({
      title: variantExperiment1.getProperty('title').getValue(),
      somethingElse: ...
    });

    variantExperiment1.getProperty('js-property').runInContext('This is an argument!');

    return container.render(html);
  });
```
