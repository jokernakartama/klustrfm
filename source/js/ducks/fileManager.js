/* eslint-disable */
import getAPI from '~/api/index.js'

// INITIAL STATE

const initialState = {
    isLoading: false,
    taskInProgress: false,
    path: '/',
    service: '',
    sort: {
      field: 'name',
      asc: true
    },
    isTrash: false,
    selectedId: false, // mostly the only case when resource id can be useful
    currentDirectory: {
      // current directory data
    },
    resources: {},     
}
export const SERVICE_SWITCHED = 'filemanager::service_switched'
export const DIRECTORY_LOADING_START = 'filemanager::directory_loading_start'
export const DIRECTORY_LOADING_END = 'filemanager::directory_loading_end'
export const DIRECTORY_UPDATE = 'filemanager::directory_update'
export const DIRECTORY_UNAVAILABLE = 'filemanager::directory_unavailable'
export const DIRECTORY_RESOURCES_SORT = 'filemanager::directory_resources_sort'
export const RESOURCE_PATCH_START = 'filemanager::resource_patch_start'
export const RESOURCE_PATCH_END = 'filemanager::resource_patch_end'
export const RESOURCE_UPDATE = 'filemanager::resource_update'
export const RESOURCE_SELECT = 'filemanager::resource_select'

/**
 * Reserializes state.
 * Useful in some actions which move resource from the current directory.
 * @param state {object} Current state
 * @returns {(object|boolean)} Resource data
 */
function getResourceDataFromState (state) {
  const selected = (state.resources && state.resources[state.selectedId]) || false
  if (!selected) {
    return false
  } else {
    return {
      id: state.selectedId,
      path: selected.path,
      parent: state.currentDirectory.path,
      service: state.service,
      isTrash: state.isTrash,
      isDir: (selected.parent !== undefined)
    }
  }
}

// ACTIONS

/**
 * Notifies that files list area is about to update.
 * Dispatched for all list changes: changing directory, pasting/removing file.
 */
export function directoryLoadingStart () {
  return {
    type: DIRECTORY_LOADING_START,
    payload: true
  }
}

/**
 * Notifies that files list requests are succeed or failed.
 * Dispatched for all list changes: changing directory, pasting/removing file.
 */
export function directoryLoadingEnd () {
  return {
    type: DIRECTORY_LOADING_END,
    payload: false
  }
}

/**
 * Notifies that selected resource data is about to update
 */
export function resourcePatchStart () {
  return {
    type: RESOURCE_PATCH_START
  }
}

/**
 * Notifies that selected resource data is about to update
 */
export function resourcePatchEnd () {
  return {
    type: RESOURCE_PATCH_END
  }
}

/**
 * Updates the directory data.
 * @param data {object} Current directory data
 */
export function directoryUpdate (data) {
  return {
    type: DIRECTORY_UPDATE,
    payload: {
      current: data.current,
      resources: data.resources,
    }
  }
}

export function directoryUnavailable() {
  return {
    type: DIRECTORY_UNAVAILABLE
  }
}

/**
 * Updates the service data: name, resource path/id, whether files are trashed.
 * @param data {object} Current directory info (as a service), parsed from url
 */
export function switchService (data) {
  return {
    type: SERVICE_SWITCHED,
    payload: {
      service: data.service,
      path: data.path,
      isTrash: data.isTrash
    }
  }
}

/**
 * Selects the resource.
 * @param id {(string|boolean|array)} Resource unique id (or id's)
 */
export function selectResource (id) {
  return {
    type: RESOURCE_SELECT,
    payload: id
  }
}

export function updateResource (data) {
  return {
    type: RESOURCE_UPDATE,
    payload: {
      id: data.id, // unique id
      value: data.value // new resource object
    }
  }
}

/**
 * Cancels all resource selections.
 */
export function deselectResource () {
  return function (dispatch) {
    dispatch(selectResource(false))
  }
}

/**
 * Parses the service data from url and dispatches files list update.
 */
export function parseLocation (location) {
  return function (dispatch) {
    if (typeof location === 'string') {
      const locationData = location.slice(1).split(/\/(.*)/, 2)
      const serviceData = locationData[0].split(':', 2)
      const path = locationData[1] || ''
      var isTrash = false
      var serviceName
      if (serviceData.length === 2) {
        serviceName = serviceData[0]
        isTrash = serviceData[1] === 'trash'
      }
      dispatch(switchService({
          service: serviceName,
          path: path,
          isTrash: isTrash
        })
      )
      dispatch(changeDirectory(path, serviceName, isTrash))
    } else {
      // dispatch(routingError())
    }
  }
}

/**
 * Loads the directory data.
 */
export function changeDirectory (dirId, serviceName, isTrash = false) {
  return function (dispatch) {
    const Service = getAPI(serviceName)
    if (Service) {
      dispatch(deselectResource())
      dispatch(directoryLoadingStart())
      Service.getResource(dirId, {
        success: (data) => {
          dispatch(directoryUpdate(data))
        },
        error: () => {
          // should be not found
          dispatch(directoryUnavailable())
        },
        fail: () => {},
        anyway: () => {
          dispatch(directoryLoadingEnd())
        }
      }, isTrash)
    } else {
      dispatch(directoryUnavailable())
    }
  }
}

export function sortResourcesList(field = 'name', asc = true) {
  return {
    type: DIRECTORY_RESOURCES_SORT,
    payload: {
      field,
      asc
    }
  }
}

/**
 * Removes or delete permanently the selected resource and dispatches directory update.
 * @param state {object}
 * @param permanently {boolean} Whether the resource should be deleted permanently
 * or moved to trash (depends on service)
 */
export function removeResource (state, permanently = false) {
  return function (dispatch) {
    const resource = getResourceDataFromState(state)
    const Service = getAPI(resource.service)
    if (Service && resource) {
      // dispatch(directoryLoadingStart())
      Service.removeResource(resource.path, {
        success: () => {
          dispatch(changeDirectory(resource.parent, resource.service, resource.isTrash))
        },
        error: () => {},
        fail: () => {},
        anyway: () => {
          // dispatch(directoryLoadingEnd())
        }
      })
    } else {
      dispatch(directoryUnavailable())
    }
  }
}

/**
 * Restores the selected resource and dispatches directory update.
 * @param state {object}
 * @param overwrite {boolean} Whether the resource should be overwrite another resource when restores
 */
export function restoreResource (state, overwrite = false) {
  return function (dispatch) {
    const resource = getResourceDataFromState(state)
    const Service = getAPI(resource.service)
    if (Service && resource) {
      // dispatch(directoryLoadingStart())
      Service.restoreResource(resource.path, {
        success: () => {
          dispatch(changeDirectory(resource.parent, resource.service, resource.isTrash))
        },
        exist: () => {
          // any dialog to submit file overwrite or not
        },
        error: () => {},
        fail: () => {},
        anyway: () => {
          // dispatch(directoryLoadingEnd())
        }
      })
    } else {
      dispatch(directoryUnavailable())
    }
  }
}

/**
 * Initiates to download file
 * @param state {object}
 */
export function downloadResource (state) {
  return function (dispatch) {
    const resource = getResourceDataFromState(state)
    const Service = getAPI(resource.service)
    if (Service && resource) {
      // dispatch(directoryLoadingStart())
      Service.getDownloadLink(resource.path, {
        success: (href) => {
          window.location.href = href
        },
        error: () => {},
        fail: () => {},
        anyway: () => {
          // dispatch(directoryLoadingEnd())
        }
      })
    } else {
      dispatch(directoryUnavailable())
    }
  }
}

/**
 * Publishes resource and modify its publicLink value
 * @param state {object}
 */
export function publishResource (state) {
  return function (dispatch) {
    const resource = getResourceDataFromState(state)
    const Service = getAPI(resource.service)
    if (Service && resource) {
      dispatch(resourcePatchStart())
      Service.publishResource(resource.path, {
        success: (url) => {
          dispatch(updateResource({
            id: resource.id,
            value: { 'publicLink': url }
          }))
        },
        error: () => {},
        fail: () => {},
        anyway: () => {
          dispatch(resourcePatchEnd())
        }
      })
    } else {
      dispatch(directoryUnavailable())
    }
  }
}


/**
 * Unpublishes resource
 * @param state {object}
 */
export function unpublishResource (state) {
  return function (dispatch) {
    const resource = getResourceDataFromState(state)
    const Service = getAPI(resource.service)
    if (Service && resource) {
      dispatch(resourcePatchStart())
      Service.unpublishResource(resource.path, {
        success: () => {
          dispatch(updateResource({
            id: resource.id,
            value: { 'publicLink': null }
          }))
        },
        error: () => {},
        fail: () => {},
        anyway: () => {
          dispatch(resourcePatchEnd())
        }
      })
    } else {
      dispatch(directoryUnavailable())
    }
  }
}

/**
 * 
 * @param state {object}
 * @param value {string} New resource name
 * @param overwrite {boolean} Whether an existed resource should be overwritten
 */
export function renameResource (state, value, overwrite = false) {
  return function (dispatch) {
    const resource = getResourceDataFromState(state)
    const Service = getAPI(resource.service)
    if (Service && resource) {
      dispatch(resourcePatchStart())
      Service.renameResource(resource.path, value, {
        success: (data) => {
          dispatch(updateResource({
            id: resource.id,
            value: data
          }))
        },
        error: () => {},
        fail: () => {},
        anyway: () => {
          dispatch(resourcePatchEnd())
        }
      }, overwrite)
    } else {
      dispatch(directoryUnavailable())
    }
  }
}

// REDUCER

const actionsMap = {
  [SERVICE_SWITCHED]: (state, action) => {
    return {
      ...state,
      path: action.payload.path,
      service: action.payload.service,
      isTrash: action.payload.isTrash
    }
  },
  [DIRECTORY_LOADING_START]: (state) => {
    return { 
      ...state,
      isLoading: true,
    }
  },
  [DIRECTORY_LOADING_END]: (state) => {
    return {
      ...state,
      isLoading: false,
    }
  },
  [DIRECTORY_UPDATE]: (state, action) => {
    return {
      ...state,
      currentDirectory: action.payload.current,
      resources: action.payload.resources
    }
  },
  [DIRECTORY_UNAVAILABLE]: (state) => {
    return {
      ...state,
      currentDirectory: false
    }
  },
  [DIRECTORY_RESOURCES_SORT]: (state, action) => {
    return {
      ...state,
      sort: action.payload
    }
  },
  [RESOURCE_PATCH_START]: (state) => {
    return {
      ...state,
      taskInProgress: true
    }
  },
  [RESOURCE_PATCH_END]: (state) => {
    return {
      ...state,
      taskInProgress: false
    }
  },
  [RESOURCE_UPDATE]: (state, action) => {
    // copy resources list to modify
    var list = Object.assign({}, state.resources)
    // modify the resource
    var resource = Object.assign(list[action.payload.id], action.payload.value)
    list[action.payload.id] = resource
    return {
      ...state,
      resources: list
    }
  },
  [RESOURCE_SELECT]: (state, action) => {
    return {
      ...state,
      selectedId: action.payload
    }
  }
}

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
