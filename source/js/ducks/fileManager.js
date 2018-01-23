import getAPI from '~/api/index.js'
import { serviceMap } from '~/api/index.js'
import { setKey, getKey } from '~/utilities/session'
import { appPrompt, appWarning, appConfirm } from '~/components/dialogs'

// INITIAL STATE
const SORTING_SETTINGS_KEY = 'sort'

var buffer = {}
for (var service in serviceMap) {
  buffer[service] = {
    id: false,
    path: false, // to use in queries
    copy: true // to use the right method
  }
}

var sortingSettings = getKey(SORTING_SETTINGS_KEY) || { field: 'name', asc: true }

export const initialState = {
  resources: {},
  currentDirectory: {
    // current directory data
  },
  path: '/',
  service: '',
  buffer,
  selectedId: false,
  sort: sortingSettings,
  error: null,
  isLoading: false,
  isTrash: false
}
export const SERVICE_SWITCHED = 'filemanager::service_switched'
export const REQUEST_START = 'filemanager::request_start'
export const REQUEST_END = 'filemanager::request_end'
export const DIRECTORY_UPDATE = 'filemanager::directory_update'
export const DIRECTORY_UNAVAILABLE = 'filemanager::directory_unavailable'
export const DIRECTORY_RESOURCES_SORT = 'filemanager::directory_resources_sort'
export const RESOURCE_PATCH_START = 'filemanager::resource_patch_start'
export const RESOURCE_PATCH_END = 'filemanager::resource_patch_end'
export const RESOURCE_UPDATE = 'filemanager::resource_update'
export const RESOURCE_SELECT = 'filemanager::resource_select'
export const BUFFER_UPDATE = 'filemanager::buffer_update'
export const ERROR_RECIEVED = 'filemanager::error_recieved'

function serviceError(Service) {
  return function (dispatch) {
    if (Service === null) {
      dispatch(throwError(1))
    } else if (Service === false) {
      dispatch(throwError(2))
    }
  }
}

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

export function throwError (code) {
  return {
    type: ERROR_RECIEVED,
    payload: code
  }
}

export function clearError () {
  return function (dispatch) {
    dispatch(throwError(null))
  }
}

export function updateBuffer (id, path, service, copy = true) {
  return {
    type: BUFFER_UPDATE,
    payload: {
      id,
      path,
      service,
      copy
    }
  }
}

export function copyOrCutInBuffer (id, path, service, copy = true) {
  return function (dispatch) {
    dispatch(updateBuffer(id, path, service, copy))
  }
}

/**
 * Notifies that the request is started.
 */
export function requestStart () {
  return {
    type: REQUEST_START
  }
}

/**
 * Notifies that the request is succeed or failed.
 */
export function requestEnd () {
  return {
    type: REQUEST_END
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


/**
 * Cancels all resource selections.
 */
export function deselectResource () {
  return function (dispatch) {
    dispatch(selectResource(false))
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
 * Parses the service data from url and dispatches files list update.
 */
export function parseLocation (location, prevService = null) {
  return function (dispatch) {
    dispatch(clearError())
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
      if (prevService !== null && serviceName !== prevService) dispatch(directoryUnavailable())
      dispatch(requestStart())
      dispatch(changeDirectory(path, serviceName, isTrash))
    } else {
      dispatch(throwError(0))
    }
  }
}

/**
 * Loads the directory data. Dispatches REQUEST_END.
 */
export function changeDirectory (dirId, serviceName, isTrash = false) {
  return function (dispatch) {
    const Service = getAPI(serviceName)
    if (Service !== null) {
      dispatch(switchService({
          service: serviceName,
          path: dirId,
          isTrash: isTrash
        })
      )
    }
    if (Service) {
      dispatch(deselectResource())
      Service.getResource(dirId, {
        success: (data) => {
          dispatch(directoryUpdate(data))
        },
        error: () => {
          // should be not found
          dispatch(throwError(404))
        },
        fail: (body, resp) => {
          if (resp === null) {
            dispatch(directoryUnavailable())
            appWarning(dispatch)(body)
          }
        },
        anyway: () => {
          dispatch(requestEnd())
        }
      }, isTrash)
    } else if (Service === null) {
      dispatch(requestEnd())
      dispatch(throwError(1))
      dispatch(directoryUnavailable())
    } else {
      dispatch(requestEnd())
      dispatch(throwError(2))
      dispatch(directoryUnavailable())
    }
  }
}

export function sortResourcesList(field = 'name', asc = true) {
  return function (dispatch) {
    setKey(SORTING_SETTINGS_KEY, {
      field,
      asc
    })
    dispatch({
      type: DIRECTORY_RESOURCES_SORT,
      payload: {
        field,
        asc
      }
    })
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
    var confirmed = true
    if (permanently) {
      confirmed = confirm('Are you sure?')
    }
    if (Service && resource) {
      if (confirmed) {
        dispatch(requestStart())
        const action = permanently ? 'deleteResource' : 'removeResource'
        Service[action](resource.path, {
          success: () => {
            dispatch(changeDirectory(resource.parent, resource.service, resource.isTrash))
          },
          error: () => {
            dispatch(requestEnd())
          },
          fail: () => {
            dispatch(requestEnd())
          }
        })
      }
    } else {
      dispatch(serviceError(Service))
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
      dispatch(requestStart())
      Service.restoreResource(resource.path, {
        success: () => {
          dispatch(changeDirectory(resource.parent, resource.service, resource.isTrash))
        },
        exist: () => {
          // any dialog to submit file overwrite or not
          dispatch(requestEnd())
          var answer = confirm('Resource already exists in the directory. \n Do you want to overwrite it?')
          if (answer) dispatch(restoreResource(state, true))
        },
        error: () => {
          dispatch(requestEnd())
        },
        fail: () => {
          dispatch(requestEnd())
        }
      }, overwrite)
    } else {
      dispatch(serviceError(Service))
    }
  }
}

export function purgeTrash (service, current) {
  return function (dispatch) {
    const Service = getAPI(service)
    if (Service) {
      appConfirm(dispatch)('Are you sure?')
        .then(() => {
          dispatch(requestStart())
          Service.purgeTrash({
            success: () => {
              dispatch(directoryUpdate({current, resources: {}}))
            },
            fail: () => {
            },
            anyway: () => {
              dispatch(requestEnd())
            }
          })
        })
    } else {
      dispatch(serviceError(Service))
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
      Service.getDownloadLink(resource.path, {
        success: (href) => {
          window.location.href = href
        },
        error: () => {},
        fail: () => {},
        anyway: () => {
        }
      })
    } else {
      dispatch(serviceError(Service))
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
      dispatch(requestStart())
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
          dispatch(requestEnd())
        }
      })
    } else {
      dispatch(serviceError(Service))
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
      dispatch(requestStart())
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
          dispatch(requestEnd())
        }
      })
    } else {
      dispatch(serviceError(Service))
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
      dispatch(requestStart())
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
          dispatch(requestEnd())
        }
      }, overwrite)
    } else {
      dispatch(serviceError(Service))
    }
  }
}

/**
 * Makes a copy or move api request
 * @param path {string} Resource identifier that used in queries
 * @param destination {string} Destination directory identifier
 * @param isCopy {boolean} Whether resource should be copied
 * @param overwrite {boolean} Whether an existing resource should be overwritten
 */
export function pasteResource (state) {
  return function (dispatch) {
    const buffer = state.buffer[state.service]
    const Service =  getAPI(state.service)
    if (Service) {
      if (buffer.path) {
        dispatch(requestStart())
        const action = buffer.copy ? 'copyResourceTo' : 'moveResourceTo'
        Service[action](buffer.path, state.currentDirectory.path, {
          success: (data) => {
            dispatch(changeDirectory(state.currentDirectory.path, state.service, state.isTrash))
            // The resource moves only once then it just will be copied from new directory
            if (!buffer.copy) dispatch(updateBuffer(data.id, data.path, state.service, true))
          },
          error: () => {
            dispatch(requestEnd())
          },
          exist: () => {
            dispatch(requestEnd())
            appWarning(dispatch)('Resource with the same path already exists in current directory.')
          },
          fail: () => {
            dispatch(requestEnd())
          }
        })
      }
    } else if (Service === null) {
      dispatch(throwError(1))
    } else {
      dispatch(throwError(2))
    }
  }
}

export function makeDir (state) {
  return function (dispatch) {
    const Service =  getAPI(state.service)
    if (Service) {
      appPrompt(dispatch)('Type new directory name')
        .then((dirName) => {
          if (dirName) {
            dispatch(requestStart())
            Service.makeDir(state.currentDirectory.path, dirName, {
              success: (data) => {
                dispatch(updateResource({
                  id: data.id,
                  value: data
                }))
              },
              error: () => {},
              exist: () => {
                appWarning(dispatch)('The directory "' + dirName + '" already exists')
              },
              fail: () => {},
              anyway: () => {
                dispatch(requestEnd())
              }
            })
          }
        })
    } else if (Service === null) {
      dispatch(throwError(1))
    } else {
      dispatch(throwError(2))
    }
  }
}

// REDUCER

const actionsMap = {
  [BUFFER_UPDATE]: (state, action) => {
    var buffer = Object.assign({}, state.buffer)
    buffer[action.payload.service] = {
      id: action.payload.id,
      path: action.payload.path,
      copy: action.payload.copy
    }
    return {
      ...state,
      buffer
    }
  },
  [SERVICE_SWITCHED]: (state, action) => {
    return {
      ...state,
      path: action.payload.path,
      service: action.payload.service,
      isTrash: action.payload.isTrash
    }
  },
  [REQUEST_START]: (state) => {
    return { 
      ...state,
      isLoading: true,
    }
  },
  [REQUEST_END]: (state) => {
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
      currentDirectory: {},
      resources: {}
    }
  },
  [DIRECTORY_RESOURCES_SORT]: (state, action) => {
    return {
      ...state,
      sort: action.payload
    }
  },
  [RESOURCE_UPDATE]: (state, action) => {
    // copy resources list to modify
    var list = Object.assign({}, state.resources)
    var resource = list[action.payload.id] || {}
    // modify the resource
    if (action.payload.value !== null) {
      list[action.payload.id] = Object.assign({}, resource, action.payload.value)
    } else {
      delete list[action.payload.id]
    }
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
  },
  [ERROR_RECIEVED]: (state, action) => {
    return {
      ...state,
      error: action.payload
    }
  }
}

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
