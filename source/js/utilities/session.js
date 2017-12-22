export default {
  start: () => {
    window.addEventListener('storage', function (event) {
      if (event.key === 'getWindowSessionStorage') {
        // another tab requests the current tab data
        window.localStorage.setItem('windowSessionStorage', JSON.stringify(window.sessionStorage))
        window.localStorage.removeItem('windowSessionStorage')
      } else if (event.key === 'windowSessionStorage') {
        // the current tab recieves other tab data
        // if sessionStorage is empty or replace existed
        var data = JSON.parse(event.newValue)
        for (let key in data) {
          window.sessionStorage.setItem(key, data[key])
        }
      }
    })
    if (window.sessionStorage.length === 0) {
      window.localStorage.setItem('getWindowSessionStorage', Date.now())
      window.localStorage.removeItem('getWindowSessionStorage')
    }
    this.start = () => { return null }
  },
  getKey: (key) => {
    var value = window.sessionStorage.getItem(key)
    try {
      value = JSON.parse(value)
    } catch (e) {
      if (e); // do nothing
    }
    return value
  },
  setKey: (key, value) => {
    try {
      value = JSON.stringify(value)
    } catch (e) {
      if (e);
      // for Date objects and functions etc.
      value = value.toString()
    }
    window.sessionStorage.setItem(key, value)
    window.localStorage.setItem('windowSessionStorage', JSON.stringify(window.sessionStorage))
    window.localStorage.removeItem('windowSessionStorage')
  }
}
