import { render } from 'preact'
import rootComp from './components/root'
import { getValue } from './utils/ls'
import getStoreProxy from './get-store-proxy'
import { enable } from 'worker-proof'
const debug = getValue('debug')

const init = () => {
  const worker = new Worker('/build/worker.js')
  enable(worker)
  
  worker.postMessage({
    type: 'initial',
    payload: {
      url: window.location.href,
      debug
    }
  })

  const proxy = getStoreProxy(worker, debug)
  window.addEventListener('popstate', () => {
    proxy.action('doUpdateUrl', [window.location.pathname])
  })

  render(rootComp(proxy), document.body)
}

init()
