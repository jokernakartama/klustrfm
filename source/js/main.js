import { start as startSession } from '~/utilities/session'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, Switch, Link } from 'react-router-dom'
import { history } from '~/utilities/history'
import App from './App'
import TokenReciever from '~/components/TokenReciever'
import StaticPage from '~/components/StaticPage'
import store from './store'
import '@/index.styl'

const SORTING_SETTINGS_KEY = 'sort'
// exclude some sessionStorage keys from crosstabs session
const excludedSessionKeys = [
  SORTING_SETTINGS_KEY
]

startSession(excludedSessionKeys).then(
  function () {
    ReactDOM.render(
      <Provider store={ store }>
        <Router basename="/" history={ history }>
          <div className="content">
            <Link to='/start' className="sample_class">start</Link>
            <Switch>
              <Route path='/token' component={ TokenReciever } />
              <Route exact path='/:service([a-z,0-9,\-]+):(trash)?/:path*' component={ App } />
              <Route exact path='/:request([^:]+)' render={ (matches) => <StaticPage pageName={matches.match.params.request} /> } />
            </Switch>
          </div>
        </Router>
      </Provider>,
      document.getElementById('app')
    )
  }
)

