import React from 'react'
import PropTypes from 'prop-types'
import bytesToString from '~/utilities/bytesToString'

export default class ResourceInfo extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    modified: PropTypes.string,
    publicLink: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    size: PropTypes.number,
    isTrash: PropTypes.bool,
    taskInProgress: PropTypes.bool,
    remove: PropTypes.func,
    restore: PropTypes.func,
    rename: PropTypes.func,
    download: PropTypes.func,
    publish: PropTypes.func,
    unpublish: PropTypes.func
  }
  
  constructor() {
    super()
    this.state = {
      readyToRename: false
    }
  }

  togglePublicity () {
    const { publicLink, publish, unpublish } = this.props
    const published = publicLink ? true : false
    if (published) {
      unpublish()
    } else {
      publish()
    }
  }
  
  changeName (e) {
    // React's onChange behavior is unlike native
    if (this.props.name !== e.target.value) {
      this.props.rename(e.target.value)
      console.log('new name is "' + e.target.value + '" (old wuz "' + this.props.name + '")')
    }
    this.showRenameField(false)
  }

  showRenameField (flag) {
    this.setState({
      readyToRename: flag
    })
  }
  
  render () {
    const { name, modified, publicLink, size, isTrash, taskInProgress, remove, restore, download } = this.props
    return (
      <div className="resource-info">
        { taskInProgress && <div className="resource-info__loading">WAIT...</div> }
        { isTrash && 'IN TRASH' }
        Name: 
        { !this.state.readyToRename && 
          <span>{ name } <button onClick={ () => this.showRenameField(true) }>rename</button></span>
        }
        { this.state.readyToRename &&
          <span>
            <input
              defaultValue={ name }
              autoFocus={ true }
              onBlur={ (e) => this.changeName(e) }
            />
          </span> 
        }  <br />
        Size: { bytesToString(size) } <br />
        Share link: <input value={ publicLink || '' } readOnly="readonly" />
        <input type="checkbox" checked={ publicLink ? true : false } onChange={ () => this.togglePublicity() } /> <br />
        Modified: { modified } <br />
        { !isTrash && <button onClick={ download }> download </button> }
        { !isTrash && <button onClick={ remove }> remove </button> }
        { isTrash && <button onClick={ restore }> restore </button> }
      </div>
    )
  }
}
