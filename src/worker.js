// polyfill fetch since it's not always available:
// https://nolanlawson.github.io/html5workertest/
if (!self.fetch) {
  importScripts(
    'https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.1/fetch.min.js'
  )
}

import { setUpWorker } from 'redux-bundler-worker'
import cache from './utils/cache'
import getStore from './bundles'

const getStoreWithData = initialData =>
  cache
    .getAll()
    .then(cached => Object.assign({}, cached, initialData))
    .then(getStore)

setUpWorker(getStoreWithData, true)
