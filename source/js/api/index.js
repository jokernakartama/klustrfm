/* eslint no-unused-vars: [0, { "args": "none" }] */

import { checkToken } from '~/utilities/tokenBag'
import { default as _CloudAPI } from './CloudAPI'
import { default as _GoogleDrive } from './GoogleDrive'
import { default as _YandexDisk } from './YandexDisk'
import { default as _Dropbox } from './Dropbox'
import { default as _Box } from './Box'
import { default as _MicrosoftOneDrive } from './MicrosoftOneDrive'

import { default as _sortList } from './sortList'

export const CloudAPI = _CloudAPI
export const GoogleDrive = _GoogleDrive
export const YandexDisk = _YandexDisk
export const Dropbox = _Dropbox
export const Box = _Box
export const MicrosoftOneDrive = _MicrosoftOneDrive
export const sortList = _sortList

const GOOGLE_DRIVE_NAME = GoogleDrive.settings.stateName
const YANDEX_DISK_NAME = YandexDisk.settings.stateName
const DROPBOX_NAME = Dropbox.settings.stateName
const BOX_NAME = Box.settings.stateName
const MICROSOFT_ONE_DRIVE_NAME = MicrosoftOneDrive.settings.stateName

export const serviceMap = {
  [GOOGLE_DRIVE_NAME]: GoogleDrive,
  [YANDEX_DISK_NAME]: YandexDisk,
  // [DROPBOX_NAME]: Dropbox,
  // [BOX_NAME]: Box,
  // [MICROSOFT_ONE_DRIVE_NAME]: MicrosoftOneDrive
}

const switchService = function (service) {
  var Service = serviceMap[service]
  if (Service) {
    const tokenData = checkToken(service)
    if (tokenData) {
      // proper token data
      return Service
    } else {
      // corrupted token data or expired token
      return false
    }
  } else {
    // unknown service
    return null
  }
}

export default switchService
