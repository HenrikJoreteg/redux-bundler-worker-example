import { h } from 'preact'
import navHelper from 'internal-nav-helper'
import { connect } from 'redux-bundler-preact'
import componentMap from './pages'

const Layout = ({ doUpdateUrl, route, pathname }) => {
  const navItems = [
    { url: '/', label: 'Home' },
    { url: '/people', label: 'People List' },
    { url: '/people/1', label: 'Person Detail' },
    { url: 'https://github.com/henrikjoreteg/redux-bundler', label: 'GitHub' }
  ]

  const Page = componentMap[route]
  return (
    <main
      onClick={navHelper(doUpdateUrl)}
      class="ph3 ph4-ns pt3 bt b--black-10 black-60"
    >
      <nav class="pa3 pa4-ns">
        <p class="b f3 tc f2-ns black-70 lh-solid mb0">
          redux-bundler sample web-worker app
        </p>
        <p class="f6 db b tc pb2">
          By:{' '}
          <a href="https://twitter.com/henrikjoreteg" class="link blue dim">
            @HenrikJoreteg
          </a>
        </p>
        <div class="tc pb3">
          {navItems.map(item => {
            return (
              <a
                class={`link dim gray f6 f5-ns dib pa2 mr1 ${
                  item.url === pathname ? 'bg-lightest-blue' : ''
                }`}
                href={item.url}
              >
                {item.label}
              </a>
            )
          })}
        </div>
      </nav>
      <Page />
    </main>
  )
}

export default connect('selectRoute', 'selectPathname', 'doUpdateUrl', Layout)
