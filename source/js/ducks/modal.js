const initialState = false

export const MODAL_OPEN = 'modal::open'
export const MODAL_CLOSED = 'modal::closed'

// Seems like there is no other way to pass the value of an argument of one function
// to another one as not an argument, except using global variables
var globalResolveFunction = false
var globalRejectFunction = false
var globalKeepOpen = false

const dialogDefaults = {
  accept: 'Ok',
  decline: 'Cancel',
  title: '',
  keep: false
}

export function openDialog(type, message = '', data = undefined, opts = {}, resolve, reject) {
  return function (dispatch) {
    const options = Object.assign({}, dialogDefaults, opts)
    globalResolveFunction = resolve
    globalRejectFunction = reject
    globalKeepOpen = options.keep
    dispatch(openModal(type, message, data, options.title, options.accept, options.decline))
  }
}

export function closeDialog (data = undefined) {
  return function (dispatch) {
    // when data is set (dialog rule is accepted) call resolve function
    if (globalResolveFunction && data !== undefined) {
      globalResolveFunction(data)
    }
    globalResolveFunction = false
    // if the dialog should not be replaced with other one
    // or dialog rule was declined close the dialog
    if (!globalKeepOpen || data === undefined) {
      if (globalRejectFunction) {
        globalRejectFunction(data)
        globalRejectFunction = false
      }
      globalKeepOpen = false
      dispatch(closeModal())
    }
  }
}

export function openModal (type, message = '', data = false, title, accept, decline) {
  return {
    type: MODAL_OPEN,
    payload: {
      type,
      message,
      title,
      data,
      accept,
      decline
    }
  }
}

export function closeModal () {
  return {
    type: MODAL_CLOSED
  }
}

const actionsMap = {
  [MODAL_OPEN]: (state, action) => {
    if (state);
    return action.payload
  },
  [MODAL_CLOSED]: () => {
    return false
  },
}

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
