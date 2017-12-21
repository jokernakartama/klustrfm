import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'

class About extends React.Component {
  render () {
    return (
      <div>
        This is about page
      </div>
    )
  }
}
class Home extends React.Component {
  render () {
    return (
      <div>
        Welcome home
      </div>
    )
  }
}

ReactDOM.render(
  <BrowserRouter basename="/">
    <div className='Page'>
      <Link to='/about'>About</Link> <Link to='/'>Home</Link>
      <Switch>
        <Route exact={true} path='/' component={Home} />
        <Route exact={true} path='/about' component={About} />
      </Switch>
    </div>
  </BrowserRouter>,
  document.getElementById('app')
)
