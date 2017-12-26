import React from 'react'
import PropTypes from 'prop-types'
import { history } from '~/utilities/history'

class Directory extends React.Component{
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    publicLink: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    path: PropTypes.string,
    service: PropTypes.string
  }
  
  createHref (service, path, trash = false) {
    return '/' + service + ':' + (trash ? 'trash' : '') + '/' + path
  } 
  
  onClickHandler (e) {
    // keep able to open link in new tab by middle click 
    if (e.button === 0) e.preventDefault()
  }

  onDoubleClickHandler (href) {
    history.push(href, { path: href })
  }

  render () {
    const { id, name, publicLink, path, service } = this.props
    const href = this.createHref(service, path)
    return (
      <a
        draggable="false" href={ href }
        className="directory resources__item" 
        id={ id } 
        onClick={ (e) => this.onClickHandler(e)}
        onDoubleClick={ () => { this.onDoubleClickHandler(href) } }
      >
        <div className={ 'icon directory__icon' + (publicLink ? ' resource__public' : '') }>
        </div>
        <span className="resources__item-name directory__name">
          { name }
        </span>
      </a>
    )
  }
}

export default Directory
