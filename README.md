# redux-bundler-worker-example

This is a somewhat sloppy but also quite complete example of how you can run an app written with [redux-bundler](https://github.com/HenrikJoreteg/redux-bundler) entirely in a Web Worker. The worker maintains the redux store, and all redux-related functionality and code gets bundled into the worker.

The main thread simply runs Preact and handles UI.

This app is nearly a straight fork of the [redux-bundler-example](https://github.com/HenrikJoreteg/redux-bundler-example) the important thing to note is that:

**The bundles and UI code written for that app remained entirely unchanged**

With very minor changes, things Just Work™ when moving this into a worker.

The main thread runs Preact and UI components and the same [redux-bundler-preact](https://github.com/HenrikJoreteg/redux-bundler-preact) bindings.

Notes and additional things demonstrated here:

* The main thread kicks things off by passing in its URL to the worker.
* Any locally cached data from indexedDB is read on load (just as the other example app), but this time that happens in the worker.
* The cached data is combined with the initial data payload from the main thread and the store is created entirely inside the worker.
* In the main thread we init the worker, and create a "store proxy" that mimics the relevant portions of the store API, but posts messages to the worker instead, where they are applied to the store as needed.
* The main thread keeps a copy, _not of the state_ but of the result of running all the selectors from the store. From then only deltas as passed to the main thread (this could be made even more efficient by only sending and tracking deltas of results the UI is currently using as indicated by selectors specified in `connect()`).
* There are times when you _need_ to be on the main thread, such as when you'd like to register global event listeners, or request geolocation, or any number or other APIs that are not yet available inside worker contexts (this, by the way, is where most examples of this type of thing seem to break down). But, it's _possible_ though, not super pretty, to still keep such code in a redux-bundle. This is demonstrated by adding a "viewport bundle" here that essentially echoes the browser's viewport size to redux state. This type of thing is occasionally useful if we need to change, not just style, but _behavior_ of an application based on viewport size. This is accomplished by serializing a function and passing it to the main thread for execution and allowing a callback to be triggered whenever required. This is done using my [worker-proof](https://github.com/HenrikJoreteg/worker-proof) library as you see used inside `/src/bundles/viewport.js`

It's deployed here: [https://redux-bundler-worker.netlify.com/](https://redux-bundler-worker.netlify.com/).

The main [redux-bundler repo](https://github.com/HenrikJoreteg/redux-bundler) is here.

There's a lot more I could go into here, but I'll save that for a later time.

Just wanted to demonstrate what's possible with relatively minor modifications when an app is built using [redux-bundler](https://github.com/HenrikJoreteg/redux-bundler).

## running it locally

```
npm i && npm start
```

Then open http://localhost:3000

## license

[MIT](http://mit.joreteg.com/)
