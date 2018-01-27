import { createRouteBundle } from 'redux-bundler'
import HomePage from '../components/pages/home'
import PersonDetailPage from '../components/pages/person-detail'
import PeoplePage from '../components/pages/people'

export default createRouteBundle({
  '/': 'home',
  '/people': 'people',
  '/people/:id': 'personDetail'
})
