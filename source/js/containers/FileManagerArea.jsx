import React from 'react';
import PropTypes from 'prop-types'
import FileList from '~/components/filemanager/FileList'
import ResourceInfo from '~/components/filemanager/ResourceInfo'
import ControlPanel from '~/components/filemanager/ControlPanel'
import SortBar from '~/components/filemanager/SortBar'
import Area from '~/components/ui/Area'
import { history } from '~/utilities/history'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as fileManagerActions from '~/ducks/fileManager'
import errors from '~/errors'

import {
  SERVICE_IS_MOUNTED_NOW
} from '~/l10n'


class FileManagerArea extends React.Component {
  static propTypes = {
    filemanager: PropTypes.object,
    actions: PropTypes.object,
    mounted: PropTypes.object
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
    const { filemanager, mounted } = this.props
    const {
      parseLocation,
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
      purgeTrash,
      makeDir
    } = this.props.actions

    const sort = filemanager.sort
    const resources = filemanager.resources
    const selectedId = filemanager.selectedId
    const activeService = filemanager.service
    const buffer = filemanager.buffer[activeService]

    const selectedResource = (resources && resources[selectedId]) || {}
    return (
      <section className="file-manager-area">
        <ControlPanel
          isTrash={ filemanager.isTrash }
          isSelected={ selectedId && (selectedId in resources) }
          emptyBuffer={ !buffer || !buffer.path }
          refresh={ () => parseLocation(history.location.pathname, activeService) }
          remove={ () => removeResource(filemanager) }
          removePermanently={ () => removeResource(filemanager, true) }
          restore={ () => restoreResource(filemanager) }
          rename={ (newName) => renameResource(filemanager, newName) }
          purge={ () => purgeTrash(filemanager.service, filemanager.currentDirectory) }
          download={ () => downloadResource(filemanager) }
          publish={ () => publishResource(filemanager) }
          unpublish={ () => unpublishResource(filemanager) }
          copyInBuffer={ () => copyOrCutInBuffer(selectedId, resources[selectedId].path, activeService) }
          cutInBuffer={ () => copyOrCutInBuffer(selectedId, resources[selectedId].path, activeService, false) }
          paste={ () => { if (!(buffer.id in resources)) pasteResource(filemanager) } }
          makedir={ () => makeDir(filemanager) }
        />
        <SortBar { ...sort } order={ sortResourcesList } />
        { filemanager.isLoading && <div>LOADING...</div>}
        <Area>
          { filemanager.error === null &&
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
          }
          
          { filemanager.error !== null &&
            <span> { errors[filemanager.error] }</span>
          }
          
          { filemanager.error !== null && mounted.mounted &&
            <div style={ {textAlign: 'center'} }>
              { SERVICE_IS_MOUNTED_NOW }<br />
              <button onClick={ () => parseLocation(history.location.pathname, activeService) }>Continue</button>
            </div>
          }
        </Area>
          { filemanager.error === null &&
            <ResourceInfo {...selectedResource}
              name={ selectedResource.name || filemanager.currentDirectory.name }
              hasSelection={ typeof selectedId === 'string' }
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
    filemanager: state.filemanager,
    mounted: state.services[state.filemanager.service]
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(fileManagerActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileManagerArea)
