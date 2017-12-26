import { serviceMap } from '~/api/index.js'
import { putToken, checkToken } from '~/utilities/tokenBag'

var initialState = {
}

for (var service in serviceMap) {
  initialState[service] = {
    name: service,
    mounted: false 
  }
}
export const SERVICE_MOUNT = 'servicepanel::service_mount'
export const SERVICE_UNMOUNT = 'servicepanel::service_unmount'
export const SERVICE_AUTHORIZATION_FAILED = 'servicepanel::service_authorization_failed'

export function mountService (serviceName) {
  return {
    type: SERVICE_MOUNT,
    payload: serviceName
  }
}

export function unmountService (serviceName) {
  return {
    type: SERVICE_UNMOUNT,
    payload: serviceName
  }
}

/**
 * Connects service according token bag data
 * @param serviceName {string}
 * @returns {boolean}
 */
export function connectService (serviceName) {
  return function (dispatch) {
    var Service = serviceMap[serviceName]
    var tokenData = checkToken(serviceName)
    /**
     * there we got checkToken as promise
     * on success save token and dispatch
     */
    if (Service && tokenData) {
      Service.saveTokenData(tokenData)
      dispatch(mountService(serviceName))
      return true
    } else {
      return false
    }
  }
}

/**
 * Connects service and adds new token data
 * recieved from an authorization window
 * @param serviceName {string}
 */
export function addService (serviceName) {
  return function (dispatch) {
    var Service = serviceMap[serviceName]
    if (Service) {
      Service.openAuthWindow((rawData, win) => {
        try {
          var parsed = JSON.parse(rawData)
          Service.getToken(parsed, (data) => {
            Service.saveTokenData(data, () => {
              putToken(serviceName, data)
            })
            dispatch(mountService(serviceName))
          }, (data) => {
            /* cannot get token */
            console.log('ERROR: ', data)
          })
        } catch (e) {
          if (e); // any error handler
          console.log(e)
        }
        win.close()
      })
    }
  }
}

const actionsMap = {
  [SERVICE_MOUNT]: (state, action) => {
    var service = Object.assign({}, state[action.payload])
    service.mounted = true
    return { 
      ...state,
      [action.payload]: service
    }
  },
  [SERVICE_UNMOUNT]: (state, action) => {
    var service = Object.assign({}, state[action.payload])
    service.mounted = false
    return { 
      ...state,
      [action.payload]: service
    }
  },
}

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
