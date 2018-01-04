import React from 'react';
import PropTypes from 'prop-types'
import FileList from '~/components/filemanager/FileList'
import ResourceInfo from '~/components/filemanager/ResourceInfo'
import SortBar from '~/components/filemanager/SortBar'
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
    const {
      changeDirectory,
      selectResource,
      removeResource,
      restoreResource,
      renameResource,
      downloadResource,
      sortResourcesList,
      publishResource,
      unpublishResource
    } = this.props.actions
    const sort = filemanager.sort

    const selectedResource = (filemanager.resources && filemanager.resources[filemanager.selectedId]) || {}
    return (
      <section className="file-manager-area">
        <SortBar { ...sort } order={ sortResourcesList } />
        <FileList { ...filemanager } getList={ changeDirectory } selectResource={ selectResource } />
        { filemanager.selectedId 
          && <ResourceInfo {...selectedResource}
            isTrash={ filemanager.isTrash }
            taskInProgress={ filemanager.taskInProgress }
            remove={ () => removeResource(filemanager) }
            restore={ () => restoreResource(filemanager) }
            rename={ (newName) => renameResource(filemanager, newName)}
            download={ () => downloadResource(filemanager) }
            publish={ () => publishResource(filemanager) }
            unpublish={ () => unpublishResource(filemanager) }
          /> 
        }
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
