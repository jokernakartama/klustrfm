import React from 'react'
import PropTypes from 'prop-types'
import Resource from '~/components/filemanager/Resource'
import { sortList } from '~/api'

const ROOT_LINK_TYPE_NAME = 'rootlink'

export default class FilesList extends React.Component {
  static propTypes = {
    path: PropTypes.string,
    service: PropTypes.string,
    currentDirectory: PropTypes.object,
    isTrash: PropTypes.bool,
    resources: PropTypes.object,
    selectResource: PropTypes.func,
    selectedId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ]),
    sort: PropTypes.object
  }

  render () {
    const {
      resources,
      currentDirectory,
      service,
      sort,
      selectResource,
      isTrash,
      selectedId
    } = this.props
    var resourcesList
    if (resources) {
      resourcesList = sortList(resources, sort.field, sort.asc).map((id, index) => {
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
          { resourcesList }
        </div>
    )
  }
}
