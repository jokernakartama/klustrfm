import React from 'react'
import PropTypes from 'prop-types'
import { history } from '~/utilities/history'

const URL_TRASH_POSTFIX = 'trash'

class Resource extends React.Component{
  static propTypes = {
    id: PropTypes.string,
    modified: PropTypes.string,
    name: PropTypes.string,
    path: PropTypes.string,
    publicLink: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.oneOf([null])
    ]),
    preview: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.oneOf([null])
    ]),
    service: PropTypes.string,
    select: PropTypes.func,
    size: PropTypes.number,
    type: PropTypes.string,
    isTrash: PropTypes.bool,
    isSelected: PropTypes.bool
  }
  
  constructor () {
    super()
    this.onClickHandler = this.onClickHandler.bind(this)
    this.onDoubleClickHandler = this.onDoubleClickHandler.bind(this)
    this.onDragStartHandler = this.onDragStartHandler.bind(this)
  }

  createHref () {
    const {
      path,
      service,
      type,
      isTrash
    } = this.props
    if ((type === 'dir' && !isTrash) || type === 'rootlink') {
      return '/' + service + ':' + (isTrash ? URL_TRASH_POSTFIX : '') + '/' + path
    } else {
      return undefined
    }
  }

  onDragStartHandler (e) {
    e.preventDefault()
  }

  onClickHandler (e) {
    // keep able to open link in new tab by middle click 
    if (e.button === 0) e.preventDefault()
    if (this.props.select) this.props.select()
  }

  onDoubleClickHandler () {
    const { type, isTrash } = this.props
    if ((type === 'dir' && !isTrash) || type === 'rootlink') {
      const href = this.createHref()
      history.push(href, { path: href })
    }
  }

  render () {
    const {
      id,
      name,
      publicLink,
      type,
      isSelected,
      isTrash,
      preview
    } = this.props
    return (
      <a
        draggable="false"
        title={ type }
        href={ this.createHref() }
        className={ 'filelist__item' + (isSelected ? ' filelist__item_selected' : '') }
        id={ id }
        onDragStart={ this.onDragStartHandler }
        onClick={ this.onClickHandler }
        onDoubleClick={ this.onDoubleClickHandler }
      >
        <div className={ 'filelist__icon icon icon_' + type } >
          { preview &&
            <div className="filelist__preview-wrapper">
                <img className="filelist__preview-img" src={ preview } />
            </div>
          }

          { publicLink &&
            <i className={[
              'icon',
              'icon_public',
              'filelist__marker',
              'filelist__marker_public'
              ].join(' ')}></i>
          }

          { isTrash &&
            <i className={[
              'icon',
              'icon_trashed',
              'filelist__marker',
              'filelist__marker_trashed'
              ].join(' ')}></i>
          }
          
        </div>
        <span className="filelist__item-name">
          { name }
        </span>
      </a>
    )
  }
}

export default Resource 
