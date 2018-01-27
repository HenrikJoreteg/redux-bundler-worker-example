import { render } from 'preact'
import rootComp from './components/root'
import { getValue, setValue } from './utils/ls'
import tryIt from 'tryit'
const debug = getValue('debug')

const selectorNameToValueName = name => {
  const start = name[0] === 's' ? 6 : 5
  return name[start].toLowerCase() + name.slice(start + 1)
}

const init = () => {
  const worker = window.worker = new Worker('/build/worker.js')
  const post = (val) => worker.postMessage(val)

  post({
    type: 'initial',
    payload: {
      url: window.location.href,
      debug
    }
  })

  const getStoreProxy = (worker) => {
    const subs = []
    const combinedData = {}

    const subscriptions = new Set()
    const watchedSelectors = {}
    const watchedValues = {}

    worker.onmessage = ({data}) => {
      if (debug) {
        console.log('🔃 from worker', data)
      }
      if (typeof data === 'string') {
        tryIt(() => {
          (new Function('worker', data))(worker) // eslint-disable-line
        }, (err) => {
          if (err) {
            console.error(err)
          }
        })
        return
      }
      if (data.urlRaw) {
        const { url } = data.urlRaw
        if (url !== window.location.href) {
          tryIt(() => {
            window.history[data.urlRaw.replace ? 'replaceState' : 'pushState']({}, null, url)
            document.body.scrollTop = 0
          })
        }
      }
      Object.assign(combinedData, data)
      
      // look through subscriptions to trigger
      subscriptions.forEach(subscription => {
        const relevantChanges = {}
        let hasChanged = false
        if (subscription.names === 'all') {
          Object.assign(relevantChanges, data)
          hasChanged = !!Object.keys(relevantChanges).length
        } else {
          subscription.names.forEach(name => {
            if (data.hasOwnProperty(name)) {
              relevantChanges[name] = data[name]
              hasChanged = true
            }
          })
        }
        if (hasChanged) {
          subscription.fn(relevantChanges)
        }
      })
    }

    const watch = selectorName => {
      watchedSelectors[selectorName] = (watchedSelectors[selectorName] || 0) + 1
    }
    const unwatch = selectorName => {
      let count = watchedSelectors[selectorName] - 1
      if (count === 0) {
        delete watchedSelectors[selectorName]
      } else {
        watchedSelectors[selectorName] = count
      }
    }

    const select = selectorNames =>
      selectorNames.reduce((obj, name) => {
        const valueName = selectorNameToValueName(name)
        obj[valueName] = combinedData[valueName]
        return obj
      }, {})

    return {
      getAll: () => combinedData,

      select,

      subscribeToSelectors: (keys, callback) => {
        const subscription = {
          fn: callback,
          names: keys.map(selectorNameToValueName)
        }
        subscriptions.add(subscription)
        keys.forEach(watch)
    
        // make sure starting values are in watched so we can
        // track changes
        Object.assign(watchedValues, select(keys))
    
        // return function that can be used to unsubscribe
        return () => {
          subscriptions.delete(subscription)
          keys.forEach(unwatch)
        }
      },

      action: (name, args) => {
        post({type: 'action', name, payload: args})
      }
    }
  }

  const proxy = getStoreProxy(worker)
  window.addEventListener('popstate', () => {
    proxy.action('doUpdateUrl', [window.location.pathname])
  })

  render(rootComp(proxy), document.body)
}

init()
