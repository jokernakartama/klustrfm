import React from 'react'
import PropTypes from 'prop-types'
import bytesToString from '~/utilities/bytesToString'

import {
  FILE_MANAGER_RESOURCE_INFO_NAME,
  FILE_MANAGER_RESOURCE_INFO_SIZE,
  FILE_MANAGER_RESOURCE_INFO_PUBLIC,
  FILE_MANAGER_RESOURCE_INFO_MODIFIED,
  FILE_MANAGER_ACTION_BUTTON_RENAME,
  FILE_MANAGER_ACTION_BUTTON_RESTORE,
  FILE_MANAGER_ACTION_BUTTON_DOWNLOAD
} from '~/l10n'

export default class ResourceInfo extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    modified: PropTypes.string,
    publicLink: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    size: PropTypes.number,
    hasSelection: PropTypes.bool,
    isTrash: PropTypes.bool,
    isFile: PropTypes.bool,
    remove: PropTypes.func,
    restore: PropTypes.func,
    rename: PropTypes.func,
    download: PropTypes.func,
    publish: PropTypes.func,
    unpublish: PropTypes.func
  }
  
  constructor() {
    super()
    this.state = {
      readyToRename: false
    }
  }

  togglePublicity () {
    const { publicLink, publish, unpublish } = this.props
    const published = publicLink ? true : false
    if (published) {
      unpublish()
    } else {
      publish()
    }
  }
  
  changeName (e) {
    // React's onChange behavior is unlike native
    if (this.props.name !== e.target.value) {
      this.props.rename(e.target.value)
    }
    this.showRenameField(false)
  }

  showRenameField (flag) {
    this.setState({
      readyToRename: flag
    })
  }
  
  render () {
    const {
      name,
      modified,
      publicLink,
      size,
      isTrash,
      isFile,
      restore,
      download
    } = this.props
    return (
      <div className={ 'resource-info' }>
        { isTrash && 'IN TRASH' }
        { FILE_MANAGER_RESOURCE_INFO_NAME }: 
        { !this.state.readyToRename && 
          <span>{ name } <button onClick={ () => this.showRenameField(true) }>{ FILE_MANAGER_ACTION_BUTTON_RENAME }</button></span>
        }
        { this.state.readyToRename &&
          <span>
            <input
              type="text"
              defaultValue={ name }
              autoFocus={ true }
              onBlur={ (e) => this.changeName(e) }
            />
          </span> 
        }  <br />
        { FILE_MANAGER_RESOURCE_INFO_SIZE } { bytesToString(size) } <br />
        { FILE_MANAGER_RESOURCE_INFO_PUBLIC } <input value={ publicLink || '' } readOnly="readonly" />
        <input type="checkbox" checked={ publicLink ? true : false } onChange={ () => this.togglePublicity() } /> <br />
        { FILE_MANAGER_RESOURCE_INFO_MODIFIED } { modified } <br />
        { !isTrash && isFile && <button onClick={ download }> { FILE_MANAGER_ACTION_BUTTON_DOWNLOAD } </button> }
        { isTrash && <button onClick={ restore }> { FILE_MANAGER_ACTION_BUTTON_RESTORE } </button> }
        <br />
      </div>
    )
  }
}
