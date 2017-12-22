import CloudAPI from './CloudAPI'
import AX from '~/utilities/ajax'
import { googleDrive } from './index.js'

/**
 * @class
 * @extends CloudAPI
 * @classdesc Google Drive API abstaraction
 * @author Sergey Kobzev <jokernakartama@gmail.com>
 * @hideconstructor
 */
class GoogleDrive extends CloudAPI {
  static get settings () {
    return {
      winHeight: '600',
      winWidth: '800',
      clientId: googleDrive.id,
      clientSecret: googleDrive.secret,
      stateName: googleDrive.name,
      redirectURI: googleDrive.redirectURI,
      listLimit: 99999,
      noRefreshBorder: 86400, // a day should be enough
      expirationHoard: 30
    }
  }

  static get urls () {
    return {
      authorize: {
        // https://developers.google.com/identity/protocols/OAuth2WebServer#creatingclient
        path: 'https://accounts.google.com/o/oauth2/v2/auth',
        params: {
          'scope': 'https://www.googleapis.com/auth/drive',
          'prompt': 'consent',
          'include_granted_scopes': 'true',
          'state': this.settings.stateName,
          'redirect_uri': this.settings.redirectURI,
          'response_type': 'token',
          'client_id': this.settings.clientId
        }
      },
      token: 'https://www.googleapis.com/oauth2/v4/token',
      checktoken: 'https://www.googleapis.com/oauth2/v3/tokeninfo',
      revoke: null,
      // these two are different
      resourceMeta: 'https://www.googleapis.com/drive/v2/files/', // use ending slash if any parameters should be included in path
      filesList: 'https://www.googleapis.com/drive/v2/files', // this one uses query parameters in url
      download: 'https://www.googleapis.com/drive/v2/files/',
      publish: 'https://www.googleapis.com/drive/v2/files/',
      unpublish: 'https://www.googleapis.com/drive/v2/files/',
      delete: 'https://www.googleapis.com/drive/v2/files/',
      remove: 'https://www.googleapis.com/drive/v2/files/',
      makedir: 'https://www.googleapis.com/drive/v2/files',
      move: 'https://www.googleapis.com/drive/v2/files/',
      copy: 'https://www.googleapis.com/drive/v2/files/',
      restore: 'https://www.googleapis.com/drive/v2/files/'
    }
  }

  static get names () {
    return {
      'serviceName': 'drive',
      'limitUrlParamName': 'limit',
      'listKey': 'items',
      'listParentObject': null,
      'itemIdKey': 'id',
      'itemTypeKey': 'mimeType',
      'itemDirKey': 'application/vnd.google-apps.folder',
      'itemPublicUrlKey': 'alternateLink',
      'itemIsSharedKey': 'shared',
      'itemNameKey': 'title',
      'itemModifiedKey': 'modifiedDate',
      'itemSizeKey': 'fileSize',
      'itemParentIsRootKey': 'isRoot',
      'rootPathIdentifier': 'root'
    }
  }

  static isDir (item) {
    return item[this.names.itemTypeKey] === this.names.itemDirKey
  }
  static isFile (item) {
    return !this.isDir(item)
  }
  static isList (rawResponse) {
    return this.names.listKey in rawResponse
  }
  static isRoot (rawData) {
    return rawData.parents.length === 0
  }
  static isShared (rawData) {
    return (rawData[this.names.itemIsSharedKey] ? rawData[this.names.itemPublicUrlKey] : false)
  }
  static getParent (rawData) {
    if (rawData.parents && rawData.parents.length) {
      if (rawData.parents[0][this.names.itemParentIsRootKey]) {
        return ''
      } else {
        return rawData.parents[0][this.names.itemIdKey]
      }
    } else {
      return null
    }
  }
  static getItemPath (item) {
    return item.id
  }

  /**
   * Validates token before using it
   * @see {@link https://developers.google.com/identity/protocols/OAuth2UserAgent#validate-access-token}
   */
  static getToken (data, callback = () => {}, error = () => {}) {
    if (!data.token || data.error !== null) {
      error(data)
    } else {
      AX.get(this.urls.checktoken, {'access_token': data.token})
        .headers()
        .status({
          'success': 200,
          'error': 400
        })
        .on('success', (body) => {
          data['expires_in'] = body['expires_in']
          if (typeof callback === 'function') callback(data)
        })
        .on('error', (body) => {
          if (typeof error === 'function') error(body)
        })
        .send()
    }
  }

  // API methods
  /**
   * As Google Drive api uses one way to change various resource
   * parameters we use the method in tasks
   * @see {@link https://developers.google.com/drive/v2/reference/files/patch}
   */
  static patchResource (id, data, func = {}) {
    AX.patch(this.urls.resourceMeta + id)
      .headers({'Authorization': 'Bearer ' + this.accessToken})
      .status({
        'success': 200,
        'error': 404,
        'fail': ['!404', '!200'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        if (typeof func.success === 'function') func.success(body, resp)
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp)
      })
      .on('error', (body, resp) => {
        if (typeof func.error === 'function') func.error(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send.json(data)
    return false
  }

  /**
   * @see {@link https://developers.google.com/drive/v2/reference/files/insert}
   */
  static makeDir (parentId, dirName, func) {
    var jsonData = {
      'title': dirName,
      'mimeType': 'application/vnd.google-apps.folder',
      'parents': [
        {
          'id': parentId
        }
      ]
    }
    AX.post(this.urls.makedir)
      .headers({'Authorization': 'Bearer ' + this.accessToken})
      .status({
        'success': 200,
        'error': 404,
        'fail': ['!404', '!200'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        var dirMeta = this.serialize(body)
        if (typeof func.success === 'function') func.success(dirMeta, resp)
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp)
      })
      .on('error', (body, resp) => {
        if (typeof func.error === 'function') func.error(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send.json(jsonData)
    return false
  }

  /**
   * @see {@link https://developers.google.com/drive/v2/reference/files/get}
   */
  static getResourceMeta (id, func = {}, params = {}) {
    if (id === '' || id === '/') id = this.names.rootPathIdentifier
    AX.get(this.urls.resourceMeta + id, params)
      .headers({'Authorization': 'Bearer ' + this.accessToken})
      .status({
        'success': [200, 304],
        'error': [404, 200],
        'fail': ['!404', '!200', '!304'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        if (typeof func.success === 'function') func.success(body, resp)
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp)
      })
      .on('error', (body, resp) => {
        if (typeof func.error === 'function') func.error(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send()
    return false
  }

  /**
   * @see GoogleDrive.getResourceMeta
   * @see GoogleDrive.getFilesList
   */
  static getResource (id, func = {}) {
    var resourceMeta
    var success = func.success
    var anyway = func.anyway

    var getFilesListCallbacks = Object.assign({}, func, {
      success: (list, resp) => {
        list.current = resourceMeta
        if (typeof success === 'function') success(list, resp)
      }
    })
    var getResourceCallbacks = Object.assign({}, func, {
      success: (body) => {
        resourceMeta = this.serialize(body)
        this.getFilesList(id, false, getFilesListCallbacks)
      },
      anyway: (body, resp) => {
        if (resourceMeta === undefined && anyway) anyway(body, resp)
      }
    })
    this.getResourceMeta(id, getResourceCallbacks, {
      fields: 'id,title,parents,mimeType'
    })
  }

  /**
   * @see {@link https://developers.google.com/drive/v2/reference/files/list}
   */
  static getFilesList (id, trash, func = {}) {
    // normalize root id
    if (id === '' || id === '/') id = this.names.rootPathIdentifier
    var urlParams = {}
    if (trash) {
      urlParams['q'] = 'trashed=true'
    } else {
      urlParams['q'] = '\'' + id + '\' in parents and trashed=false'
    }
    AX.get(this.urls.filesList, urlParams)
      .headers({'Authorization': 'Bearer ' + this.accessToken})
      .status({
        'success': [200, 304],
        'error': [404],
        'fail': ['!404', '!200', '!304'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        var list = this.serialize(body)
        if (typeof func.success === 'function') func.success(list, resp)
      })
      .on('error', (body, resp) => {
        if (typeof func.error === 'function') func.error(body, resp)
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send()
    return false
  }

  static trashList (func = {}) {
    this.getFilesList('/', true, func)
  }

  /**
   * @see GoogleDrive.getResourceMeta
   */
  static getDownloadLink (id, func = {}) {
    var success = func.success
    var error = func.error
    var callback = Object.assign({}, func, {
      success: (body, resp) => {
        if (this.isFile(body) && !!body['webContentLink']) {
          let href = body['webContentLink']
          if (typeof success === 'function') success(href, resp)
        } else {
          if (typeof error === 'function') error(body, resp)
        }
      }
    })
    this.getResourceMeta(id, callback, {
      fields: 'webContentLink,title,mimeType'
    })
  }

  /**
   * @see GoogleDrive.getResourceMeta
   */
  static getPublicLink (item, func = {}) {
    var success = func.success
    var callback = Object.assign({}, func, {
      success: (body, resp) => {
        var publicUrl = body[self.names.itemPublicUrlKey]
        if (typeof success === 'function') success(publicUrl, resp)
      }
    })
    this.getResourceMeta(item, callback, {
      fields: this.names.itemPublicUrlKey
    })
  }

  /**
   * @see GoogleDrive.patchResource
   */
  static publishResource (id, func = {}) {
    var data = {
      'shared': true
    }
    var anyway = func.anyway
    var succeed = false
    var callback = Object.assign({}, func, {
      success: () => {
        succeed = true
        this.getPublicLink(id, func)
      },
      // func.anyway should not execute twice
      anyway: (body, resp) => {
        if (!succeed && anyway) anyway(body, resp)
      }
    })
    this.patchResource(id, data, callback)
  }

  /**
   * @see GoogleDrive.patchResource
   */
  static unpublishResource (id, func = {}) {
    var data = {
      'shared': false
    }
    this.patchResource(id, data, func)
  }

  /**
   * @see {@link https://developers.google.com/drive/v2/reference/files/trash}
   */
  static removeResource (id, func = {}, params = {}) {
    if (params); // ignore as not uset
    AX.post(this.urls.remove + id + '/trash')
      .headers({'Authorization': 'Bearer ' + this.accessToken})
      .status({
        'success': 200,
        'error': 404,
        'fail': ['!404', '!200'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        if (typeof func.success === 'function') func.success(body, resp)
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp)
      })
      .on('error', (body, resp) => {
        if (typeof func.error === 'function') func.error(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send()
    return false
  }

  /**
   * @see {@link https://developers.google.com/drive/v2/reference/files/delete}
   */
  static deleteResource (id, func = {}) {
    AX.delete(this.urls.delete + id)
      .headers({'Authorization': 'Bearer ' + this.accessToken})
      .status({
        'success': 200,
        'error': 404,
        'fail': ['!404', '!200'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        if (typeof func.success === 'function') func.success(body, resp)
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp)
      })
      .on('error', (body, resp) => {
        if (typeof func.error === 'function') func.error(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send()
    return false
  }

  /**
   * @see GoogleDrive.patchResource
   */
  static renameResource (id, newname, func = {}, overwrite = false) {
    if (overwrite); // Google Drive resources are id-based so they cannot be overwritted
    var data = {
      'title': newname
    }
    this.patchResource(id, data, func)
  }

  /**
   * @see {@link https://developers.google.com/drive/v2/reference/files/copy}
   */
  static copyResourceTo (id, destination, func = {}, overwrite = false) {
    if (overwrite); // Google Drive resources are id-based so they cannot be overwritted
    AX.post(this.urls.copy + id + '/copy')
      .headers({'Authorization': 'Bearer ' + this.accessToken})
      .status({
        'success': 200,
        'error': 404,
        'fail': ['!404', '!200'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        if (typeof func.success === 'function') func.success(body, resp)
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp)
      })
      .on('error', (body, resp) => {
        if (typeof func.error === 'function') func.error(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send()
    return false
  }

  /**
   * @see GoogleDrive.patchResource
   */
  static moveResourceTo (id, destination, func = {}, overwrite = false) {
    if (overwrite); // Google Drive resources are id-based so they cannot be overwritten
    var data = {
      'parents': [
        {
          'id': destination
        }
      ]
    }
    this.patchResource(id, data, func)
  }

  /**
   * @see {@link https://developers.google.com/drive/v2/reference/files/untrash}
   */
  static restoreResource (id, func = {}, overwrite = false) {
    if (overwrite); // ignore as not uset
    AX.post(this.urls.remove + id + '/untrash')
      .headers({'Authorization': 'Bearer ' + this.accessToken})
      .status({
        'success': 200,
        'error': 404,
        'fail': ['!404', '!200'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        if (typeof func.success === 'function') func.success(body, resp)
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp)
      })
      .on('error', (body, resp) => {
        if (typeof func.error === 'function') func.error(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send()
    return false
  }
}

export default GoogleDrive
