import React from 'react'
import ServicePanel from './containers/ServicePanel'
import Modal from '~/components/dialogs/Modal'
import FileManagerArea from './containers/FileManagerArea'
import PropTypes from 'prop-types'

class App extends React.Component {
  static propTypes = {
    start: PropTypes.bool
  }

  render () {
    return (
      <div className="application">
        <ServicePanel />
        <FileManagerArea/>
        <Modal />
      </div>
    )
  }
}

export default App
