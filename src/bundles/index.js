import { composeBundles, cachingBundle } from 'redux-bundler'
import routes from './routes'
import baseData from './base-data'
import people from './people'
import viewport from './viewport'
import extraArgs from './extra-args'

export default composeBundles(
  routes,
  baseData,
  people,
  viewport,
  cachingBundle({version: 1}),
  extraArgs
)
