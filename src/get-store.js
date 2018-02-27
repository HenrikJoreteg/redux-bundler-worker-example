import { getAllCached } from 'redux-bundler'
import getStore from './bundles'

export default initialData =>
  getAllCached({ maxAge: 1000 * 60 * 60, version: 1 })
    .then(cached => Object.assign({}, cached, initialData))
    .then(getStore)
