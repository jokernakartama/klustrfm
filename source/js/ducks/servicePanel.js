import { serviceMap } from '~/api/index.js'
import { putToken, checkToken, removeToken } from '~/utilities/tokenBag'

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

function setExpirationTime (Service, data) {
  const noRefreshBorder = Service.settings.noRefreshBorder
  let expiresAt = null
  if (noRefreshBorder && data['expires_in'] && data['expires_at'] && noRefreshBorder > data['expires_in']) {
    expiresAt = data['expires_at']
  }
  return expiresAt
}

export function mountService (serviceName, expiresAt = null) {
  return {
    type: SERVICE_MOUNT,
    payload: {
      name: serviceName,
      expiresAt
    }
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
    if (Service && tokenData) {
      Service.saveTokenData(tokenData)
      let expiresAt = setExpirationTime(Service, tokenData)
      dispatch(mountService(serviceName, expiresAt))
      return true
    } else {
      return false
    }
  }
}

/**
 * Disonnects service
 * @param serviceName {string}
 * @returns {boolean}
 */
export function disconnectService (serviceName) {
  return function (dispatch) {
    var Service = serviceMap[serviceName]
    if (Service) {
      Service.revokeAuthorization(() => {
        dispatch(unmountService(serviceName))
        removeToken(serviceName)
      })
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
export function addService (serviceName, callback = false) {
  return function (dispatch) {
    var Service = serviceMap[serviceName]
    if (Service) {
      Service.openAuthWindow((rawData, win) => {
        try {
          var parsed = rawData
          Service.getToken(parsed, (data) => {
            Service.saveTokenData(data, () => {
              putToken(serviceName, data)
              if (typeof callback === 'function') callback()
              let expiresAt = setExpirationTime (Service, data)
              dispatch(mountService(serviceName, expiresAt))
            })
          }, (data) => {
            /* cannot get token */
            console.log('ERROR: ', data)
          })
        } catch (e) {
          if (e); // any error handler
          console.log(rawData, win, e)
        }
        win.close()
      })
    }
  }
}

const actionsMap = {
  [SERVICE_MOUNT]: (state, action) => {
    var service = Object.assign({}, state[action.payload.name])
    service.mounted = true
    if (action.payload.expiresAt !== null) service.expiresAt = action.payload.expiresAt
    return { 
      ...state,
      [action.payload.name]: service
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
