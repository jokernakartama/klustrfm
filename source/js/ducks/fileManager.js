/* eslint-disable */
import getAPI from '~/api/index.js'

// INITIAL STATE

const initialState = {
    isLoading: false,
    taskInProgress: false,
    path: '/',
    service: '',
    isTrash: false,
    selectedId: '', // mostly the only case when resource id can be useful
    currentDirectory: {
      // current directory data
    },
    resources: {
      /* this is what be recieved throught serivice api 
      directories: {
        'id1': {
          id: 'id1',
          name: 'My pics',
          parent: 'id0',
          isRoot: false,
          path: '/My pics',
          public: false
        },
        'id2': {
          id: 'id1',
          name: 'ma crap',
          parent: 'id0',
          isRoot: false,
          path: '/ma crap',
          public: 'http://ontuihncp.ht/athuaheud'
        },
      },
      files: {
        'id3': {
          id: 'id3',
          name: 'notes.txt',
          modified: '25 Oct 2014',
          size: 2534,
          path: '/notes.txt',
          public: false
        },
        'id4': {
          id: 'id4',
          name: 'avatar.jpg',
          modified: '25 Oct 2014',
          size: 5461654,
          path: '/avatar.jpg',
          public: false
        },
      }
      */
    }        
}
export const SERVICE_SWITCHED = 'filemanager::service_switched'
export const DIRECTORY_LOADING_START = 'filemanager::directory_loading_start'
export const DIRECTORY_LOADING_END = 'filemanager::directory_loading_end'
export const DIRECTORY_UPDATE = 'filemanager::directory_update'
export const DIRECTORY_UNAVAILABLE = 'filemanager::directory_unavailable'
export const DIRECTORY_RESOURCES_SORT = 'filemanager::directory_resources'
export const RESOURCE_PATCH_START = 'filemanager::resource_patch_start'
export const RESOURCE_PATCH_END = 'filemanager::resource_patch_end'
export const RESOURCE_UPDATE = 'filemanager::resource_update'
export const RESOURCE_SELECT = 'filemanager::resource_select'
export const HIDE_RESOURCE_ACTION_PANEL = 'filemanager::hide_resource_action_panel'
export const CHANGE_DIRECTORY_DATA = 'filemanager::change_directory_data'

// ACTIONS

/**
 * Action notifies that files list area is about to update
 * Dispatched for all list changes: changing directory, pasting/removing file
 */
export function directoryLoadingStart () {
  return {
    type: DIRECTORY_LOADING_START,
    payload: true
  }
}
/**
 * Action notifies that files list requests are succeed or failed
 * Dispatched for all list changes: changing directory, pasting/removing file
 */
export function directoryLoadingEnd () {
  return {
    type: DIRECTORY_LOADING_END,
    payload: false
  }
}
/**
 * Action updates the directory data
 */
export function directoryUpdate (data) {
  return {
    type: DIRECTORY_UPDATE,
    payload: {
      current: data.current,
      directories: data.directories,
      files: data.files
    }
  }
}

export function directoryUnavailable() {
  return {
    type: DIRECTORY_UNAVAILABLE
  }
}

/**
 * Action updates the service data: name, resource path/id, whether files are trashed
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
 * Action parses the service data from url and dispatches files list update
 */
export function parseLocation (location) {
  console.log('location ' + location + ' parsing')
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
      console.log(locationData)
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
 * Action loads the directory data
 */
export function changeDirectory (dirId, serviceName, isTrash = false) {
  return function (dispatch) {
    const Service = getAPI(serviceName)
    if (Service) {
      dispatch(directoryLoadingStart())
      Service.getResource(dirId, {
        success: (data) => {
          dispatch(directoryUpdate(data))
        },
        error: () => {},
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
export function selectFile (id) {
  return function (dispatch) {
    const data = id
    dispatch(fileSelected(data))
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
      directories: action.payload.directories,
      files: action.payload.files
    }
  },
  [DIRECTORY_UNAVAILABLE]: (state) => {
    return {
      ...state,
      currentDirectory: false
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
    var resources = Object.assign({}, state[action.payload.key])
    resources[action.payload.resource][action.payload.field] = [action.payload.data]
    return {
      ...state,
      resources
    }
  },
   [RESOURCE_SELECT]: (state, action) => {
    return {
      ...state,
      selectedId: action.payload
    }
  },
  [HIDE_RESOURCE_ACTION_PANEL]: (state) => {
    return state
  },
  [CHANGE_DIRECTORY_DATA]: (state) => {
    return state
  }
}

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
