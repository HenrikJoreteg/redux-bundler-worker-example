import { render } from 'preact'
import root from './components/root'

export default store =>
  render(root(store), document.getElementById('app'))
