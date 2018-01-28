import React from 'react'
import PropTypes from 'prop-types'

import {
  FILE_MANAGER_SORT_SORTBY,
  FILE_MANAGER_SORT_BUTTON_NAME,
  FILE_MANAGER_SORT_BUTTON_SIZE,
  FILE_MANAGER_SORT_BUTTON_TYPE,
  FILE_MANAGER_SORT_BUTTON_PUBLICITY
} from '~/l10n'

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
        { FILE_MANAGER_SORT_SORTBY } &nbsp;

        <button onClick={ () => order('name', asc) } className={[
          'sortbar__button',
          'sortbar__button_action_field',
          (field === 'name' ? 'sortbar__button_active' : '' )
        ].join(' ')}>
        { FILE_MANAGER_SORT_BUTTON_NAME }
        </button>

        <button onClick={ () => order('size', asc) } className={[
          'sortbar__button',
          'sortbar__button_action_field',
          (field === 'size' ? 'sortbar__button_active' : '')
        ].join(' ')}>
        { FILE_MANAGER_SORT_BUTTON_SIZE }
        </button>
        
        <button onClick={ () => order('type', asc) } className={[
          'sortbar__button',
          'sortbar__button_action_field',
          (field === 'type' ? 'sortbar__button_active' : '')
        ].join(' ')}>
        { FILE_MANAGER_SORT_BUTTON_TYPE }
        </button>
        
        <button onClick={ () => order('publicLink', asc) } className={[
          'sortbar__button',
          'sortbar__button_action_field',
          (field === 'publicLink' ? 'sortbar__button_active' : '')
        ].join(' ')}>
        { FILE_MANAGER_SORT_BUTTON_PUBLICITY }
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
