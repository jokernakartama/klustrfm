import React from 'react'
import PropTypes from 'prop-types'
import Alert from './Alert'
import Confirm from './Confirm'
import Prompt from './Prompt'

class Dialog extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    data: PropTypes.any,
    message: PropTypes.string,
    title: PropTypes.string,
    accept: PropTypes.string,
    decline: PropTypes.string,
    close: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.changePosition = this.changePosition.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.state = {
      top: 0,
      left: 0
    }
  }
  
  changePosition (event, top = null, left = null) {
    if (event);
    var el = this.dialogElement
    var win = window.document.documentElement
    if (el) {
      if (top === null) top = (win.clientHeight - el.offsetHeight) / 2
      if (left === null) left = (win.offsetWidth - el.offsetWidth) / 2
      this.setState({
        left,
        top
      })
    }
  }
  
  closeDialog (e) {
    if (e.keyCode === 27) {
      this.props.close()
    }
  }
  
  componentDidMount () {
    this.changePosition()
    window.addEventListener('resize', this.changePosition)
    window.document.addEventListener('keyup', this.closeDialog)
  }
  
  componentWillUnmount () {
    window.removeEventListener('resize', this.changePosition)
    window.document.removeEventListener('keyup', this.closeDialog)
  }
  
  prepareText (str) {
    const parts = str.split('\n')
    const len = parts.length - 1
    // console.log(parts)
    return parts.map((string, index) => {
      return <React.Fragment key={ index }>{ string } { index < len && <br /> }</React.Fragment>
    })
  }
  
  render () {
    const { data, type, message, title, accept, decline, close } = this.props
    const dialogMap = {
      info: Alert,
      warning: Alert,
      error: Alert,
      confirm: Confirm,
      prompt: Prompt
    }
    const DialogType = dialogMap[type] || null
    const style = {
      top: this.state.top,
      left: this.state.left
    }
    return (
      <div style={ style } className={ 'dialog dialog_type_' + type } ref={ (el) => { this.dialogElement = el } }>
        { title && title !== '' && <div className="dialog__title">{ title }</div> }
        <div className="dialog__message">{ this.prepareText(message) }</div>
        <div className="dialog__controls">
          <DialogType
            data={ data }
            accept={ accept }
            decline={ decline }
            close={ close }
          />
        </div>
      </div>
    )
  }
}

export default Dialog
