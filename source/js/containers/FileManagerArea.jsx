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

  componentDidMount () {
    const { parseLocation } = this.props.actions
    this.unlisten = history.listen((location) => {
      parseLocation(location.pathname)
    })
    parseLocation(history.location.pathname)
  }

  componentWillUnmount () {
    this.unlisten()
  }

  render () {
    const { filemanager } = this.props
    const { changeDirectory } = this.props.actions
    return (
      <section className="file-manager-area">
        <FileList { ...filemanager } getList={ changeDirectory } />
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
