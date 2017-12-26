import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class Partition extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    mounted: PropTypes.bool,
    mount: PropTypes.func,
    connect: PropTypes.func
  }
  componentDidMount () {
    this.props.connect()
  }
  mountControl () {
    const { mounted, mount } = this.props
    if (mounted) {
      return (
        <a className="service-list__mount service-state_mounted" onClick={ () => { mount(); alert('service was unmounted (not)') } }>
          &larr; 
        </a>
      )
    } else {
      return (
        <a className="service-list__mount service-state_unmounted" onClick={ mount }>
          &harr; 
        </a>
      )
    }
  }
  
  render () {
    const { name } = this.props
    return (
          <li className={ 'service-list__service' + ' service-name_' + name }>
            <span className="service-list__link">
              <i className={ 'service-list__icon ' +  ' icon_' + name }></i>
              <Link to={'/' + name + ':/'}>{ name }</Link>
            </span>
            { this.mountControl() }
          </li>
    )
  }
}

export default Partition
