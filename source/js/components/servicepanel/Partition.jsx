import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import expirationTime from '~/utilities/expirationTime'

import {
  SERVICE_PANEL_MOUNT,
  SERVICE_PANEL_UNMOUNT,
  SERVICE_PANEL_SERVICE_NAME,
  SERVICE_PANEL_EXPIRES_IN
} from '~/l10n'

class Partition extends React.Component {
  static propTypes = {
    active: PropTypes.bool,
    name: PropTypes.string,
    expiresAt: PropTypes.number,
    mounted: PropTypes.bool,
    mount: PropTypes.func,
    unmount: PropTypes.func,
    connect: PropTypes.func
  }
  
  constructor (props) {
    super(props)
    this.state = {
      timeout: 0
    }
  }
  
  clearCounters () {
    window.clearInterval(this.timer)
    this.timer = false
    this.props.unmount()
  }
  
  componentDidMount () {
    const { connect } = this.props
    connect()
  }
  
  componentDidUpdate () {
    const { expiresAt, unmount, mounted } = this.props
    if (!mounted && this.timer) {
      this.clearCounters()
    }
    if (expiresAt && !this.timer && this.props.mounted) {
      this.timer = window.setInterval(() => {
        const timeRemains = this.props.expiresAt - expirationTime(0)
        if (timeRemains >= 0) {
          this.setState({
            timeout: timeRemains
          })
        } else {
          this.setState({
            timeout: 0
          })
          window.clearInterval(this.timer)
          this.timer = false
          unmount()
        }
      }, 1000)
    }
  }
  
  componentWillUnmount () {
    this.clearCounters()
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
            <br />
              { this.state.timeout > 0 && SERVICE_PANEL_EXPIRES_IN.format(this.state.timeout) }
          </li>
    )
  }
}

export default Partition
