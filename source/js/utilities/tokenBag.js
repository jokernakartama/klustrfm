import * as session from '~/utilities/session'
import expirationTime from '~/utilities/expirationTime'

export const TOKEN_BAG_PREFIX = 'token_'

/**
 * Saves token in session storage.
 * @param serviceName {string}
 * @param data {object} Token data {token: value, expires_in: value}
 */
export function putToken (serviceName, data) {
  const key = TOKEN_BAG_PREFIX + serviceName
  if (data['expires_in'] === null) data['expires_in'] = 31536000
  data['expires_at'] = expirationTime(data['expires_in'])
  session.setKey(key, data)
}

/**
 * Gets token from session storage
 * @param serviceName {string}
 * @returns {object} Token data
 */
export function ejectToken (serviceName) {
  const key = TOKEN_BAG_PREFIX + serviceName
  return session.getKey(key)
}

/**
 * Check service token availability in token bag
 * @param service {string} Service name from service map
 * @returns {(object|boolean)} Returns false if token data is not proper (token is expired or absent)
 * else returns token data object
 */
export function checkToken (service) {
  var tokenData = ejectToken(service)
  if (tokenData) {
    if (tokenData['expires_at']) {
      const now = expirationTime(0)
      const future = tokenData['expires_at']
      const hoard =  future - now
      if (hoard > 0) {
        return tokenData
      } else {
        // if token expiration makes the token inapplicable
        return false
      }
    } else {
      // even if token is not expired
      // expiration data absence says that token data in memory is corrupted
      return false
    }
  } else {
    // any token data is absent
    return false
  }
}
