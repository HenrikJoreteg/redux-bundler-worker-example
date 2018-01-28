if (!self.fetch) {
  importScripts('https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.1/fetch.min.js')
}

import ms from 'milliseconds'
import { getAllCached } from 'redux-bundler'
import createStore from './bundles'

const dataPromise = getAllCached({ version: 1, maxAge: ms.weeks(1) })
let store

self.onmessage = ({data}) => {
  console.log('📦 sent to worker', data)
  const { cbId, type, payload, name } = data

  if (type === 'initial') {
    dataPromise
      .then(cached => {
        store = createStore(Object.assign({}, cached, payload))
        self.postMessage(store.selectAll())
        store.subscribeToAllChanges(changes => {
          self.postMessage(changes)
        })
      })
  } 
  else if (type === 'callback') {
    self[cbId](data)
    delete self[cbId]
  } 
  else if (type === 'action') {
    const args = payload || []
    const fn = store[name]
    if (!fn) {
      throw Error(`💥 no action ${name} on store`)
    }
    fn(...args)
  }
}
