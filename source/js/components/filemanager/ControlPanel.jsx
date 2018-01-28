import React from 'react'
import PropTypes from 'prop-types'

import {
  FILE_MANAGER_ACTION_BUTTON_REFRESH,
  FILE_MANAGER_ACTION_BUTTON_MKDIR,
  FILE_MANAGER_ACTION_BUTTON_REMOVE,
  FILE_MANAGER_ACTION_BUTTON_COPY,
  FILE_MANAGER_ACTION_BUTTON_CUT,
  FILE_MANAGER_ACTION_BUTTON_PASTE,
  FILE_MANAGER_ACTION_BUTTON_PURGE
} from '~/l10n'

class ControlPanel extends React.Component {
  static propTypes = {
    isTrash: PropTypes.bool,
    isSelected: PropTypes.bool,
    emptyBuffer: PropTypes.bool,
    refresh: PropTypes.func,
    remove: PropTypes.func,
    removePermanently: PropTypes.func,
    restore: PropTypes.func,
    purge: PropTypes.func,
    rename: PropTypes.func,
    download: PropTypes.func,
    publish: PropTypes.func,
    unpublish: PropTypes.func,
    copyInBuffer: PropTypes.func,
    cutInBuffer: PropTypes.func,
    paste: PropTypes.func,
    makedir: PropTypes.func
  }
  
  render () {
    const {
      isTrash,
      isSelected,
      emptyBuffer,
      refresh,
      remove,
      purge,
      makedir,
      cutInBuffer,
      copyInBuffer,
      paste
    } = this.props
    const disabled = !(!isTrash && isSelected)
    return (
      <div>
        { isTrash && <button onClick={ purge }> { FILE_MANAGER_ACTION_BUTTON_PURGE } </button> }
        <button onClick={ refresh }> { FILE_MANAGER_ACTION_BUTTON_REFRESH } </button>
        <button onClick={ makedir } disabled={ isTrash }> { FILE_MANAGER_ACTION_BUTTON_MKDIR } </button>
        <button onClick={ remove } disabled={ disabled }> { FILE_MANAGER_ACTION_BUTTON_REMOVE } </button>
        <button onClick={ copyInBuffer } disabled={ disabled }> { FILE_MANAGER_ACTION_BUTTON_COPY } </button>
        <button onClick={ cutInBuffer } disabled={ disabled }> { FILE_MANAGER_ACTION_BUTTON_CUT } </button>
        <button onClick={ paste } disabled={ !(!isTrash && !emptyBuffer) }> { FILE_MANAGER_ACTION_BUTTON_PASTE } </button>
      </div>
    )
  }
}

export default ControlPanel
