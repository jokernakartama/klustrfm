import React from 'react'
import PropTypes from 'prop-types'

class ControlPanel extends React.Component {
  static propTypes = {
    isTrash: PropTypes.bool,
    isSelected: PropTypes.bool,
    emptyBuffer: PropTypes.bool,
    remove: PropTypes.func,
    removePermanently: PropTypes.func,
    restore: PropTypes.func,
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
      remove,
      removePermanently,
      makedir,
      cutInBuffer,
      copyInBuffer,
      paste
    } = this.props
    const disabled = !(!isTrash && isSelected)
    return (
      <div>
        { isTrash && <button> purge trash </button> }
        <button onClick={ makedir } disabled={ isTrash }> mkdir </button>
        <button onClick={ remove } disabled={ disabled }> remove </button>
        <button onClick={ removePermanently } disabled={ disabled }> delete </button>
        <button onClick={ copyInBuffer } disabled={ disabled }> copy </button>
        <button onClick={ cutInBuffer } disabled={ disabled }> cut </button>
        <button onClick={ paste } disabled={ !(!isTrash && !emptyBuffer) }> paste </button>
        { /* flush button for trash */ }
      </div>
    )
  }
}

export default ControlPanel
