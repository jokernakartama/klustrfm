import React from 'react'
import PropTypes from 'prop-types'

class File extends React.Component{
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
    modified: PropTypes.string,
    path: PropTypes.string,
    publicLink: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ])
  }

  render () {
    const { id, name, publicLink } = this.props
    return (
      <div className="file resources__item" id={ id }>
        <div className={ 'icon file__icon' + (publicLink ? ' resource__public' : '') }>
        </div>
        <span className="resources__item-name file__name">
          { name }
        </span>
      </div>
    )
  }
}

export default File
