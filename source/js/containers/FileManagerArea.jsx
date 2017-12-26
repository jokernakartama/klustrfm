import React from 'react';
import PropTypes from 'prop-types'
import FileList from '~/components/filemanager/FileList'
import { history } from '~/utilities/history'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as fileManagerActions from '~/ducks/fileManager'

class FileManagerArea extends React.Component {
  static propTypes = {
    filemanager: PropTypes.object,
    actions: PropTypes.object
  }

  constructor(props) {
    super(props)
    const { changeDirectory } = this.props.actions
    this.changeDir = changeDirectory
  }

  parseLocation (location) {
    if (typeof location === 'string') {
      const locationData = location.slice(1).split(/\/(.*)/, 2)
      const serviceData = locationData[0].split(':', 2)
      const path = locationData[1] || ''
      var isTrash = false
      var serviceName
      if (serviceData.length === 2) {
        serviceName = serviceData[0]
        isTrash = serviceData[1] === 'trash'
      }
      return {
        service: serviceName,
        path: path,
        isTrash: isTrash
      }
    } else {
      return {}
    }
  }

  componentDidMount () {
    const data = this.parseLocation(history.location.pathname)
    this.unlisten = history.listen((location) => {
      let data = this.parseLocation(location.pathname)
      this.changeDir(data.path, data.service)
    })
    this.changeDir(data.path, data.service)
  }

  componentWillUnmount () {
    this.unlisten()
  }

  render () {
    const { filemanager } = this.props
    const { changeDirectory } = this.props.actions
    const data = this.parseLocation(history.location.pathname)
    return (
      <section className="file-manager-area">
        <FileList 
          { ...filemanager }
          getList={ changeDirectory }
          service={ data.service }
          path={ data.path }
        />
      </section>
    )
  }
}

function mapStateToProps (state) {
  return {
    filemanager: state.filemanager,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(fileManagerActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileManagerArea)
