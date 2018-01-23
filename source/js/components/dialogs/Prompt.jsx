import React from 'react'
import PropTypes from 'prop-types'

class Prompt extends React.Component {
  static propTypes = {
    data: PropTypes.any,
    accept: PropTypes.string,
    decline: PropTypes.string,
    close: PropTypes.func
  }
  
  constructor (props) {
    super(props)
    this.state = {
      data: props.data
    }
  }
  
  onChangeHandler (e) {
    this.setState({
      data: e.target.value
    })
  }
  
  onKeyPressHandler (e) {
    if (e.charCode === 13) {
      if (e.target.selectionStart === e.target.value.length && e.target.value.length > 0) {
        this.props.close(this.state.data)
      }
    }
  }
  
  render () {
    const { accept, decline, close } = this.props
    const { data } = this.state
    return (
      <React.Fragment>
        <div className="dialog__inputs">
          <input
            type="text"
            defaultValue={ data }
            autoFocus={ true }
            onChange={ (e) => this.onChangeHandler(e) }
            onKeyPress={ (e) => this.onKeyPressHandler(e) }
          />
        </div>
        <div className="dialog__buttons">
          <button onClick={ () => close(data) } className="button dialog__button dialog__button_type_positive">
            { accept }
          </button>
          <button onClick={ () => close() } className="button dialog__button dialog__button_type_negative">
            { decline }
          </button>
        </div>
      </React.Fragment>
    )
  }
}

export default Prompt
