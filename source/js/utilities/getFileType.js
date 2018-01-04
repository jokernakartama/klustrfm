const DEFAULT_TYPE = 'file'

const AUDIO = 'audio'
const ARCHIVE = 'archive'
const PICTURE = 'picture'
// the difference between picture and image is that
// image can have no preview
const IMAGE = 'image'
const DOCUMENT = 'document'
const SCRIPT = 'script'
const PLAIN_TEXT = 'plaintext'
const VIDEO = 'video'
const WEBPAGE = 'webpage'

const extTypes = {
  '.7z': ARCHIVE,
  '.aac': AUDIO,
  '.avi': VIDEO,
  '.bmp': IMAGE,
  '.csv': DOCUMENT,
  '.doc': DOCUMENT,
  '.docx': DOCUMENT,
  '.gz': ARCHIVE,
  '.htm': WEBPAGE,
  '.html': WEBPAGE,
  '.jpg': PICTURE,
  '.jpeg': PICTURE,
  '.js': SCRIPT,
  '.json': PLAIN_TEXT,
  '.png': PICTURE,
  '.gif': PICTURE,
  '.psd': IMAGE,
  '.svg': IMAGE,
  '.svgz': IMAGE,
  '.mp3': AUDIO,
  '.rtf': DOCUMENT,
  '.rar': ARCHIVE,
  '.sh': SCRIPT,
  '.php': SCRIPT,
  '.txt': PLAIN_TEXT,
  '.zip': ARCHIVE
}

export function getFileExtention (name) {
  var ext = /(\.?[^.]+\.?)$/.exec(name)
  if (ext !== null) {
    return ext[1].toLowerCase() || name
  } else {
    return name
  }
}

export default function (name) {
  return extTypes[getFileExtention(name)] || DEFAULT_TYPE
}
