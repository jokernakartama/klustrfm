import CloudAPI from './CloudAPI'
import AX from '~/utilities/ajax'
import { default as pathJoin, dirname } from '~/utilities/path.join'
import { yandexDisk } from './index.js'

/**
 * @class
 * @extends CloudAPI
 * @classdesc Yandex Disk API abstaraction
 * @author Sergey Kobzev <jokernakartama@gmail.com>
 * @hideconstructor
 */
class YandexDisk extends CloudAPI {
  static get settings () {
    return {
      winHeight: '600',
      winWidth: '800',
      clientId: yandexDisk.id,
      clientSecret: yandexDisk.secret,
      stateName: yandexDisk.name,
      listLimit: 99999
    }
  }

  static get urls () {
    return {
      authorize: {
        path: 'https://oauth.yandex.ru/authorize',
        params: {
          'response_type': 'token',
          'client_id': this.settings.clientId,
          'force_confirm': 1,
          'state': this.settings.stateName
        }
      },
      token: 'https://oauth.yandex.ru/token',
      revoke: null,
      resourceMeta: 'https://cloud-api.yandex.net:443/v1/disk/resources',
      filesList: 'https://cloud-api.yandex.net:443/v1/disk/resources',
      trashList: 'https://cloud-api.yandex.net:443/v1/disk/trash/resources',
      download: 'https://cloud-api.yandex.net:443/v1/disk/resources/download',
      publish: 'https://cloud-api.yandex.net:443/v1/disk/resources/publish',
      unpublish: 'https://cloud-api.yandex.net:443/v1/disk/resources/unpublish',
      delete: 'https://cloud-api.yandex.net:443/v1/disk/resources',
      remove: 'https://cloud-api.yandex.net:443/v1/disk/resources',
      makedir: 'https://cloud-api.yandex.net:443/v1/disk/resources',
      move: 'https://cloud-api.yandex.net:443/v1/disk/resources/move',
      copy: 'https://cloud-api.yandex.net:443/v1/disk/resources/copy',
      restore: 'https://cloud-api.yandex.net:443/v1/disk/trash/resources/restore'
    }
  }

  static get names () {
    return {
      'serviceName': 'disk',
      'pathQueryPrefix': '/',
      'limitUrlParamName': 'limit',
      'listKey': 'items',
      'listParentObject': '_embedded',
      'itemIdKey': 'resource_id',
      'itemTypeKey': 'type',
      'itemDirKey': 'dir',
      'itemPublicUrlKey': 'public_url',
      'itemFileKey': 'file',
      'itemNameKey': 'name',
      'itemModifiedKey': 'modified',
      'itemSizeKey': 'size',
      'rootPathIdentifier': '/'
    }
  }

  static isDir (item) {
    return item[this.names.itemTypeKey] === this.names.itemDirKey
  }
  static isFile (item) {
    return item[this.names.itemTypeKey] === this.names.itemFileKey
  }
  static isList (rawResponse) {
    return this.names.listKey in rawResponse
  }
  static isRoot (rawData) {
    var itemPath = this.getItemPath(rawData)
    return itemPath === '/' || itemPath === ''
  }
  static isShared (rawData) {
    return rawData[this.names.itemPublicUrlKey] || false
  }
  static getParent (rawData) {
    var itemPath = this.getItemPath(rawData)
    var parent
    if (this.isRoot(rawData)) {
      parent = null
    } else {
      // just cut off directory name with a beginning slash
      parent = itemPath.slice(0, -rawData.name.length - 1)
    }
    return parent
  }
  static getItemPath (item) {
    return item.path.slice(6) // cut the "disk:/" prefix
  }

  /**
   * As query path of parsed resource has no slash at start,
   * this method makes right path for api query.
   * @param path {string} Parsed resource query path (generally with no slash at start)
   */
  static createPath (path) {
    if (path.slice(0, 1) === '/') {
      return path
    } else {
      return this.names.pathQueryPrefix + path
    }
  }

  /**
   * Does nothing except error handling
   */
  static getToken (data, callback = () => {}, error = () => {}) {
    if (!data.token || data.error !== null) {
      error(data)
    } else {
      callback(data)
    }
  }

  // API methods

  /**
   * @see {@link https://tech.yandex.ru/disk/poligon/#!//v1/disk/resources/CreateResource}
   */
  static makeDir (parentPath, dirName, func = {}) {
    var destination = pathJoin(parentPath, dirName)
    var urlParams = {path: this.createPath(destination)}
    var success = func.success
    AX.put(this.urls.makedir, urlParams)
      .headers({'Authorization': 'OAuth ' + this.accessToken})
      .status({
        'success': 201,
        'error': 404,
        'exist': 409,
        'fail': ['!404', '!201', '!409'],
        'anyway': '!201'
      })
      .on('success', () => {
        var callback = Object.assign(func, {
          success: (body, resp) => {
            var dirMeta = this.serialize(body)
            if (typeof success === 'function') success(dirMeta, resp)
          }
        })
        this.getResourceMeta(destination, callback)
      })
      .on('exist', (body, resp) => {
        if (typeof func.exist === 'function') func.exist(body, resp)
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
   * @see {@link https://tech.yandex.ru/disk/poligon/#!//v1/disk/resources/GetResource}
   */
  static getResourceMeta (path, func = {}, params = {}) {
    params['path'] = this.createPath(path)
    AX.get(this.urls.resourceMeta, params)
      .headers({'Authorization': 'OAuth ' + this.accessToken})
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
   * @see YandexDisk.getFilesList
   */
  static getResource (path, func = {}, trash = false) {
    // just calls another method because we can get resource information later
    this.getFilesList(path, func, trash)
  }

  static getFilesList (path, func = {}, trash = false) {
    // normalize root path
    if (path === '') {
      path = this.names.rootPathIdentifier
    } else {
      path = this.createPath(path)
    }
    var url = trash ? this.urls.trashList : this.urls.filesList
    var urlParams = {}
    urlParams[this.names.limitUrlParamName] = this.settings.listLimit
    urlParams['path'] = trash ? '/' : path
    AX.get(url, urlParams)
      .headers({'Authorization': 'OAuth ' + this.accessToken})
      .status({
        'success': 200,
        'error': 404,
        'fail': ['!404', '!200'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        var list = this.serialize(body[this.names.listParentObject])
        list.current = this.serialize(body)
        if (typeof func.success === 'function') func.success(list, resp)
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
   * @see {@link https://tech.yandex.ru/disk/poligon/#!//v1/disk/resources/GetResourceDownloadLink}
   */
  static getDownloadLink (path, func) {
    /* От этого метода ожидается получить ссылку */
    AX.get(this.urls.download, {path: this.createPath(path)})
      .headers({'Authorization': 'OAuth ' + this.accessToken})
      .status({
        'success': 200,
        'error': 404,
        'fail': ['!404', '!200'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        var href = body.href
        if (typeof func.success === 'function') func.success(href, resp)
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp) // диспатчим экшн
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

  static getPublicLink (path, func = {}) {
    this.getResourceMeta(path, func, {fields: this.names.itemPublicUrlKey})
  }

  /**
   * @see {@link https://tech.yandex.ru/disk/poligon/#!//v1/disk/resources/PublishResource}
   */
  static publishResource (path, func = {}) {
    var urlParams = {path: this.createPath(path)}
    var self = this
    var success = func.success
    AX.put(this.urls.publish, urlParams)
      .headers({'Authorization': 'OAuth ' + this.accessToken})
      .status({
        'success': 200,
        'error': 404,
        'fail': ['!404', '!200'],
        'anyway': '!200' // as we use a nested request in getPublicLink if this one is succeed, this callback should not run multiple times
      })
      .on('success', () => {
        var callback = Object.assign(func, {
          success: (body) => {
            var publicUrl = body[self.names.itemPublicUrlKey]
            if (typeof success === 'function') success(publicUrl)
          }
        })
        this.getPublicLink(path, callback)
      })
      .on('fail', (body, resp) => {
        if (typeof func.fail === 'function') func.fail(body, resp) // диспатчим экшн
      })
      .on('error', (body, resp) => {
        if (typeof func.error === 'function') func.error(body, resp)
      })
      .on('anyway', (body, resp) => {
        if (typeof func.anyway === 'function') func.anyway(body, resp)
      })
      .send.text()
    return false
  }

  /**
   * @see {@link https://tech.yandex.ru/disk/poligon/#!//v1/disk/resources/UnpublishResource}
   */
  static unpublishResource (path, func) {
    var urlParams = {path: this.createPath(path)}
    AX.put(this.urls.unpublish, urlParams)
      .headers({'Authorization': 'OAuth ' + this.accessToken})
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
        if (typeof func.fail === 'function') func.fail(body, resp) // диспатчим экшн
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
   * @see {@link https://tech.yandex.ru/disk/poligon/#!//v1/disk/resources/DeleteResource}
   */
  static removeResource (path, func, urlParams = {}) {
    urlParams = Object.assign(urlParams, {path: this.createPath(path)})
    AX.delete(this.urls.remove, urlParams)
      .headers({'Authorization': 'OAuth ' + this.accessToken})
      .status({
        'success': [202, 204],
        'error': 404,
        'fail': ['!404', '!202', '!204'],
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
   * @see {@link https://tech.yandex.ru/disk/poligon/#!//v1/disk/resources/DeleteResource}
   */
  static deleteResource (file, func) {
    this.removeFile(file, func, {permanently: true})
  }

  static copyOrMove (copy, currentPath, destination, func, overwrite = false) {
    // As the only urls are different, this method is common for both actions
    var url = copy ? this.urls.copy : this.urls.move
    var urlParams = {
      from: this.createPath(currentPath),
      path: this.createPath(destination),
      overwrite: overwrite
    }
    AX.post(url, urlParams)
      .headers({'Authorization': 'OAuth ' + this.accessToken})
      .status({
        'success': [201, 202],
        'error': 404,
        'exist': 409,
        'fail': ['!404', '!201', '!409'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        if (typeof func.success === 'function') func.success(body, resp)
      })
      .on('exist', (body, resp) => {
        if (typeof func.exist === 'function') func.exist(body, resp)
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
   * @see YandexDisk.moveResourceTo
   */
  static renameResource (resourcePath, newname, func, overwrite = false) {
    var parent = dirname(resourcePath)
    var destination = pathJoin(parent, newname)
    this.moveResourceTo(resourcePath, destination, func, overwrite)
  }

  /**
   * @see {@link https://tech.yandex.ru/disk/poligon/#!//v1/disk/resources/CopyResource}
   */
  static copyResourceTo (path, destination, func = {}, overwrite = false) {
    this.copyOrMove(true, path, destination, func, overwrite)
  }

  /**
   * @see {@link https://tech.yandex.ru/disk/poligon/#!//v1/disk/resources/MoveResource}
   */
  static moveResourceTo (path, destination, func = {}, overwrite = false) {
    this.copyOrMove(false, path, destination, func, overwrite)
  }

  /**
   * @see {@link https://tech.yandex.ru/disk/poligon/#!//v1/disk/trash/resources/RestoreFromTrash}
   */
  static restoreResource (path, func = {}, overwrite = false) {
    var urlParams = {
      path: this.createPath(path),
      overwrite: overwrite
    }
    AX.post(this.urls.restore, urlParams)
      .headers({'Authorization': 'OAuth ' + this.accessToken})
      .status({
        'success': [201, 202],
        'error': 404,
        'exist': 409,
        'fail': ['!404', '!201', '!409'],
        'anyway': 'all'
      })
      .on('success', (body, resp) => {
        if (typeof func.success === 'function') func.success(body, resp)
      })
      .on('exist', (body, resp) => {
        if (typeof func.exist === 'function') func.exist(body, resp)
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

export default YandexDisk
