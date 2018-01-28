// https://gist.github.com/0i0/1519811
String.prototype.format = function () {
  var args = arguments
  return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (curlyBrack, index) {
      return ((curlyBrack == "{{") ? "{" : ((curlyBrack == "}}") ? "}" : args[index]))
  })
}

export const SERVICE_PANEL_SERVICE_NAME = {
  disk: 'Yandex.Disk',
  drive: 'Google Drive',
  dropbox: 'Dropbox',
  box: 'Box',
  onedrive: 'OneDrive'
}

export const ROUTING_ERROR = 'Routing error' 
export const UNKNOWN_SERVICE = 'The service is unavailable'
export const SERVICE_NOT_MOUNTED = 'The service is not mounted'
export const RESOURCE_NOT_FOUND = 'Requested resource is not found on this storage'
export const SERVICE_CONTINUE = 'Continue'
export const SERVICE_IS_MOUNTED_NOW = 'The service is mounted now'

export const SERVICE_PANEL_MOUNT = 'Mount '
export const SERVICE_PANEL_UNMOUNT = 'Unmount '
export const SERVICE_PANEL_TRASH = 'Trash'
export const SERVICE_PANEL_EXPIRES_IN = 'token expires in {0}s'

export const FILE_MANAGER_NOTICE_PATH_EXISTS = 'A resource with the same path already exists in the current directory.'

export const FILE_MANAGER_SORT_SORTBY = 'Sort by'
export const FILE_MANAGER_SORT_BUTTON_NAME = 'name'
export const FILE_MANAGER_SORT_BUTTON_SIZE = 'size'
export const FILE_MANAGER_SORT_BUTTON_TYPE = 'type'
export const FILE_MANAGER_SORT_BUTTON_PUBLICITY = 'publicity'
export const FILE_MANAGER_SORT_BUTTON_ASCENDING = 'ascending'
export const FILE_MANAGER_SORT_BUTTON_DESCENDING = 'descending'

export const FILE_MANAGER_ACTION_BUTTON_REFRESH = 'Refresh'
export const FILE_MANAGER_ACTION_BUTTON_MKDIR = 'Make a directory'
export const FILE_MANAGER_ACTION_BUTTON_REMOVE = 'Remove'
export const FILE_MANAGER_ACTION_BUTTON_COPY = 'Copy'
export const FILE_MANAGER_ACTION_BUTTON_CUT = 'Cut'
export const FILE_MANAGER_ACTION_BUTTON_PASTE = 'Paste'
export const FILE_MANAGER_ACTION_BUTTON_PURGE = 'Purge trash'
export const FILE_MANAGER_ACTION_BUTTON_RESTORE = 'Restore'
export const FILE_MANAGER_ACTION_BUTTON_DOWNLOAD = 'Download'
export const FILE_MANAGER_ACTION_BUTTON_RENAME = 'Rename'

export const FILE_MANAGER_RESOURCE_INFO_NAME = 'Name'
export const FILE_MANAGER_RESOURCE_INFO_SIZE = 'Size'
export const FILE_MANAGER_RESOURCE_INFO_PUBLIC = 'Public link'
export const FILE_MANAGER_RESOURCE_INFO_MODIFIED = 'Modified'
