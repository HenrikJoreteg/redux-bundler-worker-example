if (!self.fetch) {
  importScripts('https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.1/fetch.min.js')
}

import ms from 'milliseconds'
import { getAllCached } from 'redux-bundler'
import createStore from './bundles'

const dataPromise = getAllCached({ version: 1, maxAge: ms.weeks(1) })
let store

const selectedState = {
  before: {},
  after: {}
}

const getChanged = () => {
  const changed = {}
  const { before, after } = selectedState
  for (const item in after) {
    if (before[item] !== after[item]) {
      changed[item] = after[item]
    }
  }
  return changed
}

self.onmessage = ({data}) => {
  console.log('🔃 from main', data)
  const { cbId, type, payload, name } = data

  if (type === 'callback') {
    self[cbId](data)
    delete self[cbId]
  }

  if (type === 'initial') {
    dataPromise.then(cached => {
      store = createStore(Object.assign({}, cached, payload))
      const update = () => {
        selectedState.after = store.selectAll()
        const changed = getChanged()
        delete changed.urlObject
        self.postMessage(changed)
        selectedState.before = selectedState.after
      }
      store.subscribe(update)
      update()
    })
    return
  }

  if (type === 'action') {
    const args = payload || []
    const fn = store[name]
    if (!fn) {
      throw Error(`💥 no action ${name} on store`)
    }
    fn(...args)
    return
  }
}
