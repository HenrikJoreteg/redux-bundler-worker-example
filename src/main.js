import renderRoot from './render-root'
import { getStoreProxy } from 'redux-bundler-worker'
const worker = new Worker('/build/worker.js')

renderRoot(getStoreProxy(worker))
