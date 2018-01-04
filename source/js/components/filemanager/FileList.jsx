import React from 'react'
import PropTypes from 'prop-types'
import Resource from '~/components/filemanager/Resource'
import { getFileExtention } from '~/utilities/getFileType'

const DIR_TYPE_NAME = 'dir'
const ROOT_LINK_TYPE_NAME = 'rootlink'
const DEFAULT_SORT_FIELD = 'name'
const TYPE_FIELD_NAME = 'type'
const PUBLIC_LINK_FIELD_NAME = 'publicLink'

export default class FilesList extends React.Component {
  static propTypes = {
    path: PropTypes.string,
    service: PropTypes.string,
    currentDirectory: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ]),
    isTrash: PropTypes.bool,
    resources: PropTypes.object,
    getList: PropTypes.func,
    selectResource: PropTypes.func,
    selectedId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    sort: PropTypes.object,
    isLoading: PropTypes.bool
  }
  
  sortBy (o, field = DEFAULT_SORT_FIELD, asc = true) {
    var sorted = Object.keys(o)
    sorted.sort(function (a, b) {
      var j = o[a][field]
      var k = o[b][field]
      if (!j || !k) {
        j = Boolean(!j)
        k = Boolean(!k)
      }
      if ((o[a].type === DIR_TYPE_NAME && o[b].type !== DIR_TYPE_NAME) || (o[a].type !== DIR_TYPE_NAME && o[b].type === DIR_TYPE_NAME)) {
        // directories first
        return o[b].type === DIR_TYPE_NAME
      } else {
        if (o[a].type === DIR_TYPE_NAME && o[b].type === DIR_TYPE_NAME) {
          // directories can be sorted only by name
          if (field === DEFAULT_SORT_FIELD && !asc) {
            return o[b].name > o[a].name
          } else if (field === PUBLIC_LINK_FIELD_NAME) {
            if (asc) {
              return j > k
            } else {
              return k > j
            }
          } else {
            return o[a].name > o[b].name
          }
        } else {
          if (field === TYPE_FIELD_NAME) {
            if (asc) {
              return getFileExtention(o[a].name) > getFileExtention(o[b].name)
            } else {
              return getFileExtention(o[b].name) > getFileExtention(o[a].name)
            }
          } else {
            if (asc) {
              return j > k
            } else {
              return k > j
            }
          }
        }
      }
    })
    return sorted
  }

  getCurrentDirectory () {
    const {
      resources,
      currentDirectory,
      service,
      sort,
      isLoading,
      selectResource,
      isTrash,
      selectedId
    } = this.props

    if (isLoading) {
      return <div className="filelist__loading">LOADING...</div>
    } else {
      if (currentDirectory) {
        var resourcesList
        if (resources) {
          resourcesList = this.sortBy(resources, sort.field, sort.asc).map((id, index) => {
            return (
              <Resource
                id={ id }
                isRoot={ resources[id].isRoot }
                isSelected={ id === selectedId}
                isTrash={ isTrash }
                key={ index }
                modified={ resources[id].modified }
                name={ resources[id].name }
                parent={ resources[id].parent }
                path={ resources[id].path }
                publicLink={ resources[id].publicLink }
                preview={ (resources[id].type === 'picture' || resources[id].type === 'image') ? resources[id].preview : null }
                select={ () => { selectResource(id) } }
                service={ service }
                size={ resources[id].size }
                type={ resources[id].type }
              />
            )
          })
        }
        return (
          <div className="filelist">
            { !currentDirectory.isRoot
              && currentDirectory.parent !== null
              && currentDirectory.parent !== undefined
              && !isTrash
              && <Resource
                  name="../"
                  path={ currentDirectory.parent }
                  type={ ROOT_LINK_TYPE_NAME }
                  service={ service }
                />
            }
            { isTrash
              && <Resource
                  name="../"
                  path=''
                  type={ ROOT_LINK_TYPE_NAME }
                  service={ service }
                />
            }
            {resourcesList}
          </div>
        )
      } else {
        return 'Directory or service is unavailable (currentDirectory is false)'
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
