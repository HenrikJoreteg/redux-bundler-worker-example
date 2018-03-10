import { composeBundles, createCacheBundle } from 'redux-bundler'
import routes from './routes'
import baseData from './base-data'
import people from './people'
import viewport from './viewport'
import extraArgs from './extra-args'
import cache from '../utils/cache'

export default composeBundles(
  routes,
  baseData,
  people,
  viewport,
  createCacheBundle(cache.set),
  extraArgs
)
