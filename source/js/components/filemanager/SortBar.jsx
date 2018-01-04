import React from 'react'
import PropTypes from 'prop-types'

class SortBar extends React.Component {
  static propTypes = {
    field: PropTypes.string,
    asc: PropTypes.bool,
    order: PropTypes.func.isRequired
  }

  render () {
    const { field, asc, order } = this.props
    return (
      <div className="sortbar">
        Sort by &nbsp;

        <button onClick={ () => order('name', asc) } className={[
          'sortbar__button',
          'sortbar__button_action_field',
          (field === 'name' ? 'sortbar__button_active' : '' )
        ].join(' ')}>
        name
        </button>

        <button onClick={ () => order('size', asc) } className={[
          'sortbar__button',
          'sortbar__button_action_field',
          (field === 'size' ? 'sortbar__button_active' : '')
        ].join(' ')}>
        size
        </button>
        
        <button onClick={ () => order('type', asc) } className={[
          'sortbar__button',
          'sortbar__button_action_field',
          (field === 'type' ? 'sortbar__button_active' : '')
        ].join(' ')}>
        type
        </button>
        
        <button onClick={ () => order('publicLink', asc) } className={[
          'sortbar__button',
          'sortbar__button_action_field',
          (field === 'publicLink' ? 'sortbar__button_active' : '')
        ].join(' ')}>
        publicity
        </button>

        &nbsp;&nbsp;&nbsp;
        
        <button className="sortbar__button sortbar__button_action_direction" onClick={ () => order(field, !asc) }>
          { asc ? '↑' : '↓' }
        </button>
      </div>
    )
  }
}

export default SortBar
