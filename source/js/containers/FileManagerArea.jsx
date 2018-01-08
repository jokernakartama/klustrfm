import React from 'react';
import PropTypes from 'prop-types'
import FileList from '~/components/filemanager/FileList'
import ResourceInfo from '~/components/filemanager/ResourceInfo'
import ControlPanel from '~/components/filemanager/ControlPanel'
import SortBar from '~/components/filemanager/SortBar'
import { history } from '~/utilities/history'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as fileManagerActions from '~/ducks/fileManager'
import errors from '~/errors'

class FileManagerArea extends React.Component {
  static propTypes = {
    filemanager: PropTypes.object,
    actions: PropTypes.object
  }

  componentDidMount () {
    const { parseLocation } = this.props.actions
    this.unlisten = history.listen((location) => {
      let service = this.props.filemanager.service
      parseLocation(location.pathname, service)
    })
    parseLocation(history.location.pathname)
  }

  componentWillUnmount () {
    this.unlisten()
  }

  render () {
    const { filemanager } = this.props
    const {
      selectResource,
      removeResource,
      restoreResource,
      renameResource,
      downloadResource,
      sortResourcesList,
      publishResource,
      unpublishResource,
      copyOrCutInBuffer,
      pasteResource,
      makeDir
    } = this.props.actions

    const sort = filemanager.sort
    const resources = filemanager.resources
    const selectedId = filemanager.selectedId
    const activeService = filemanager.service
    const buffer = filemanager.buffer[activeService]
    
    var mapPathToId = {}
    for (let id in resources) {
      mapPathToId[resources[id].path] = id
    }

    const selectedResource = (resources && resources[selectedId]) || {}
    return (
      <section className="file-manager-area">
        { /* что то типа if (filemanager.error === null || filemanager.error > 2)  */}
        
        {/*
          if filemanager.error = 2
          <ServiceMountBtn />
          else if (filemanager.error === null || filemanager.error > 2)
          <SortBar />
          <FileList />
          <ResourceInfo />
          */}
        <ControlPanel
          isTrash={ filemanager.isTrash }
          isSelected={ selectedId && (selectedId in resources) }
          emptyBuffer={ !buffer || !buffer.path }
          remove={ () => removeResource(filemanager) }
          removePermanently={ () => removeResource(filemanager, true) }
          restore={ () => restoreResource(filemanager) }
          rename={ (newName) => renameResource(filemanager, newName)}
          download={ () => downloadResource(filemanager) }
          publish={ () => publishResource(filemanager) }
          unpublish={ () => unpublishResource(filemanager) }
          copyInBuffer={ () => copyOrCutInBuffer(selectedId, resources[selectedId].path, activeService) }
          cutInBuffer={ () => copyOrCutInBuffer(selectedId, resources[selectedId].path, activeService, false) }
          paste={ () => { if (!(buffer.id in resources)) pasteResource(filemanager, mapPathToId) } }
          makedir={ () => makeDir(filemanager) }
        />
        <SortBar { ...sort } order={ sortResourcesList } />
        { filemanager.isLoading && <div>LOADING...</div>}
        
        { filemanager.error === null ?
          <FileList
            path={ filemanager.path }
            service={ filemanager.service }
            currentDirectory={ filemanager.currentDirectory }
            isTrash={ filemanager.isTrash }
            resources={ filemanager.resources }
            selectedId={ filemanager.selectedId }
            sort={ filemanager.sort }
            selectResource={ selectResource }
          />
          :
          !filemanager.isLoading && <span> { errors[filemanager.error] }</span>
        }
        { selectedId && typeof selectedId === 'string'
          && <ResourceInfo {...selectedResource}
            isFile={ selectedResource.type !== 'dir' }
            isTrash={ filemanager.isTrash }
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
    filemanager: state.filemanager
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(fileManagerActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileManagerArea)
