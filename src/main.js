import { render, h } from 'preact'
import { Provider } from 'redux-bundler-preact'
import Layout from './components/layout'
import { getStoreProxy } from 'redux-bundler-worker'

const worker = new Worker('/build/worker.js')
const storeProxy = getStoreProxy(worker, true)

render(
  <Provider store={storeProxy}>
    <Layout />
  </Provider>,
  document.getElementById('app')
)
