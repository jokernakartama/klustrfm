export default function (seconds) {
  var now = Date.now() / 1000 | 0
  return (+seconds) + now
}
