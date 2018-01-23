import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as modalActions from '~/ducks/modal'
import Dialog from './Dialog'

class Modal extends React.Component {
  static propTypes = {
    payload: PropTypes.any,
    close: PropTypes.func
  }
  
  render () {
    const { close, payload } = this.props
    return (
      <div className={ 'dialog-wrapper' + (payload !== false ? ' dialog-wrapper_open' : '') }>
          { payload && 
            <Dialog
              type={ payload.type }
              data={ payload.data }
              title={ payload.title }
              message={ payload.message }
              accept={ payload.accept }
              decline={ payload.decline }
              close={ close }
            />
          }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    payload: state.modal,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    close: bindActionCreators(modalActions.closeDialog, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal)
