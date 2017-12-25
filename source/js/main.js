import session from '~/utilities/session' 
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, Switch, Link } from 'react-router-dom'
import { history } from '~/utilities/history'
import App from './App'
import TokenReciever from '~/components/TokenReciever'
import StaticPage from '~/components/StaticPage'
import configureStore from './store'
import '@/index.styl'

session.start()

const store = configureStore()

ReactDOM.render(
  <Provider store={ store }>
    <Router basename="/" history={ history }>
      <div className="page">
        <Link to='/about'>about</Link>
        <Switch>
          <Route path='/token' component={ TokenReciever } />
          <Route exact path='/:service([a-z,0-9,\-]+):(trash)?/:path*' component={ App } />
          <Route exact path='/:request([^:]+)' component={ StaticPage } />
        </Switch>
      </div>
    </Router>
  </Provider>,
  document.getElementById('app')
)
