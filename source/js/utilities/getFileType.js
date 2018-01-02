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
  '7z': ARCHIVE,
  'aac': AUDIO,
  'avi': VIDEO,
  'bmp': IMAGE,
  'csv': DOCUMENT,
  'doc': DOCUMENT,
  'docx': DOCUMENT,
  'htm': WEBPAGE,
  'html': WEBPAGE,
  'jpg': PICTURE,
  'js': SCRIPT,
  'json': PLAIN_TEXT,
  'png': PICTURE,
  'psd': IMAGE,
  'svg': IMAGE,
  'svgz': IMAGE,
  'mp3': AUDIO,
  'rtf': DOCUMENT,
  'sh': SCRIPT,
  'txt': PLAIN_TEXT,
}

export default function (name) {
  var ext = /\.?([^.]+\.?)$/.exec(name)
  if (ext !== null) {
    return extTypes[ext[1].toLowerCase()] || DEFAULT_TYPE
  } else {
    return DEFAULT_TYPE
  }
}
