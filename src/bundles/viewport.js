import runOnMain from '../utils/run-on-main'
import { debounce } from 'redux-bundler'

export default {
  name: 'viewport',
  getReducer: () => {
    const initialState = {
      width: null,
      height: null
    }
    return (state = initialState, {type, payload}) => {
      if (type === 'WINDOW_RESIZED') {
        return payload
      }
      return state
    }
  },
  doTrackWindowResize: dimensions => ({type: 'WINDOW_RESIZED', payload: dimensions}),
  init: store => {
    const callback = debounce(store.doTrackWindowResize, 200)
    runOnMain((cb, debounce) => {
      cb({
        height: window.innerHeight,
        width: window.innerWidth
      })
      window.addEventListener('resize', () => {
        cb({
          height: window.innerHeight,
          width: window.innerWidth
        })
      }, {passive: true})
    }, callback)
  }
}
