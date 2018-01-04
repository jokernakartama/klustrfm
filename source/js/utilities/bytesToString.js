const steps = [
  'B',
  'KiB',
  'MiB',
  'GiB',
  'TiB' // tibibytes should be enough
]

const bytesToString  = function bytesToString (bytes, step = 0) {
  if (typeof bytes === 'number' && !isNaN(bytes) && isFinite(bytes)) {
    var elder = bytes / 1024
    if (elder < 1 || !steps[step + 1]) {
      return (Math.round(bytes * 100) / 100) + ' ' + steps[step]
    } else {
      return bytesToString (elder, (step + 1))
    }
  } else {
    return bytes
  }
} 

export default bytesToString
