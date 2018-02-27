// polyfill fetch since it's not always available:
// https://nolanlawson.github.io/html5workertest/
if (!self.fetch) {
  importScripts(
    'https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.1/fetch.min.js'
  )
}

import { setUpWorker } from 'redux-bundler-worker'
import { getAllCached } from 'redux-bundler'
import getStore from './bundles'

const getStoreWithData = initialData =>
  getAllCached({ maxAge: 1000 * 60 * 60, version: 1 })
    .then(cached => Object.assign({}, cached, initialData))
    .then(getStore)

setUpWorker(getStoreWithData, true)
