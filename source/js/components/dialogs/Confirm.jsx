import React from 'react'
import PropTypes from 'prop-types'

class Confirm extends React.Component {
  static propTypes = {
    data: PropTypes.any,
    accept: PropTypes.string,
    decline: PropTypes.string,
    close: PropTypes.func
  }
  render () {
    const { data, accept, decline, close } = this.props
    return (
      <div className="dialog__buttons">
        <button autoFocus={ true } onClick={ () => close(data) } className="button dialog__button dialog__button_type_positive">
          { accept }
        </button>
        <button onClick={ () => close() } className="button dialog__button dialog__button_type_negative">
          { decline }
        </button>
      </div>
    )
  }
}

export default Confirm
