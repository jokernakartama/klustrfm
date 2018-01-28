import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import {
  SERVICE_PANEL_MOUNT,
  SERVICE_PANEL_UNMOUNT,
  SERVICE_PANEL_SERVICE_NAME
} from '~/l10n'

class Partition extends React.Component {
  static propTypes = {
    active: PropTypes.bool,
    name: PropTypes.string,
    mounted: PropTypes.bool,
    mount: PropTypes.func,
    unmount: PropTypes.func,
    connect: PropTypes.func
  }
  componentDidMount () {
    const { connect } = this.props
    connect()
  }
  mountControl () {
    const { name, mounted, mount, unmount } = this.props
    if (mounted) {
      return (
        <button className="service-list__mount service-state_mounted" onClick={ unmount } title={ SERVICE_PANEL_UNMOUNT + (SERVICE_PANEL_SERVICE_NAME[name] || name) }>
          &larr; 
        </button>
      )
    } else {
      return (
        <button className="service-list__mount service-state_unmounted" onClick={ mount } title={ SERVICE_PANEL_MOUNT + (SERVICE_PANEL_SERVICE_NAME[name] || name) }>
          &harr; 
        </button>
      )
    }
  }
  
  render () {
    const { name, active } = this.props
    return (
          <li className={ 'service-list__service' + ' service-name_' + name + (active ? ' service-list__service_active' : '') }>
            <span className="service-list__link">
              <i className={ 'service-list__icon ' +  ' icon_' + name }></i>
              <Link to={'/' + name + ':/'}>{ SERVICE_PANEL_SERVICE_NAME[name] || name }</Link>
            </span>
            { this.mountControl() }
          </li>
    )
  }
}

export default Partition
