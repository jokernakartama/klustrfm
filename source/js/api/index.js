/* eslint no-unused-vars: [0, { "args": "none" }] */

import { checkToken } from '~/utilities/tokenBag'
import GoogleDrive from './GoogleDrive'
import YandexDisk from './YandexDisk'
import Dropbox from './Dropbox'
import Box from './Box'
import MicrosoftOneDrive from './MicrosoftOneDrive'
import googleDriveConfig from './configs/GoogleDrive.config'
import yandexDiskConfig from './configs/YandexDisk.config'
import dropboxConfig from './configs/Dropbox.config'
import boxConfig from './configs/Box.config'
import microsoftOneDriveConfig from './configs/MicrosoftOneDrive.config'

const GOOGLE_DRIVE_NAME = googleDriveConfig.name
const YANDEX_DISK_NAME = yandexDiskConfig.name
const DROPBOX_NAME = dropboxConfig.name
const BOX_NAME = boxConfig.name
const MICROSOFT_ONE_DRIVE_NAME = microsoftOneDriveConfig.name

export const googleDrive = googleDriveConfig
export const yandexDisk = yandexDiskConfig
export const dropbox = dropboxConfig
export const box = boxConfig
export const microsoftOneDrive = microsoftOneDriveConfig

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
    return false
  }
}

export default switchService
