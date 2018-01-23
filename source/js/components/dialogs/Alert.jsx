import React from 'react'
import PropTypes from 'prop-types'

class Alert extends React.Component {
  static propTypes = {
    accept: PropTypes.string,
    close: PropTypes.func
  }
  render () {
    const { accept, close } = this.props
    return (
      <div className="dialog__buttons">
        <button autoFocus={ true } onClick={ () => close() } className="button dialog__button dialog__button_type_positive">
          { accept }
        </button>
      </div>
    )
  }
}
export default Alert
  
