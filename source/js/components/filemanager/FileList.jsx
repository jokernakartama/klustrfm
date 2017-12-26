import React from 'react'
import PropTypes from 'prop-types'
import Directory from '~/components/filemanager/Directory'
import File from '~/components/filemanager/File'

export default class FilesList extends React.Component {
  static propTypes = {
    path: PropTypes.string,
    service: PropTypes.string,
    currentDirectory: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ]),
    files: PropTypes.object,
    directories: PropTypes.object,
    getList: PropTypes.func,
    isLoading: PropTypes.bool
  }
  
  componentDidMount () {
    const { path, service, getList } = this.props
    getList(path, service)
  }

  getCurrentDirectory () {
    const { path, files, directories, currentDirectory, service, isLoading } = this.props
    if (isLoading) {
      return <div className="filelist__loading">LOADING...</div>
    } else {
      if (currentDirectory) {
        var directoryList
        var fileList
        if (directories) {
          directoryList = Object.keys(directories).map((id, index) => {
            return (
              <Directory
                key={ index }
                id={ id }
                name={ directories[id].name }
                publicLink={ directories[id].public }
                parent={ directories[id].parent }
                isRoot={ directories[id].isRoot }
                path={ directories[id].path }
                service={ service }
              />
            )
          })
        }
        if (files) {
          fileList = Object.keys(files).map((id, index) => {
            return (
              <File
                key={ index }
                id={ id }
                name={ files[id].name }
                modified={ files[id].modified }
                size={ files[id].size }
                path={ files[id].path }
                publicLink={ files[id].public }
              />
            )
          })
        }
        return (
          <div className="eto_vremennyj_wrapper">
          <h1>The path is { path }, service is { service || 'UNDEFINED' }</h1>
          <div className="data">
            { !currentDirectory.isRoot
              && currentDirectory.parent !== null
              && currentDirectory.parent !== undefined
              && <Directory
                  name="../"
                  path={ currentDirectory.parent }
                  service={ service }
                />
            }
            {directoryList} 
            {fileList}
          </div>
          </div>
        )
      } else {
        return 'Directory or service is unavailable'
      }
    }
  }

  render () {
    return (
      <div className="filelist">
        { this.getCurrentDirectory() }
      </div>
    )
  }
}
