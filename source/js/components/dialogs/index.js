import { openDialog } from '~/ducks/modal'
import Promise from 'promise-polyfill'

// Omit uncaught exceptions to use Promise.catch() only
// to handle dialog cancelling
Promise._unhandledRejectionFn = function() {}

// global functions

// Available options:
// * title - addtional explanation
// * keep - keeps the dialog open, use it only if the dialog calls another dialog in chain
// * accept - sets a confirm button name
// * decline - sets a decline button name
// These functions return promises so they can be chained like this:
// appPrompt(dispatch)('Please, type your name', '', { accept: 'This one is mine' })
//   .then(name => {
//     return appConfirm(dispatch)('Are you\'re sure that you are ' + name + '?', { accept: 'Yeah', decline: 'No, I\'m not' })
//   })
//   .then(() => {
//     appInfo(dispatch)('Brilliant')
//   })
//   .catch(() => {
//     return appConfirm(dispatch)('You were about to confirm your name, but drop that. Is any chance to get it?', { accept: 'I\'ll try again', decline: 'No way!' })
//   })
//   .then(() => {
//     return appPrompt(dispatch)('So, what\'s your name?')
//   })
//   .then((name) => {
//     appInfo(dispatch)(name + '. Okay than.')
//   })
//   .catch(() => {
//     appWarning(dispatch)('Your life, your rules')
//   })

/**
 * Replaces window.alert
 * @param message {string} Message to be shown in the dialog
 * @param option {object} Additional parameters
 * @returns {Promise}
 */
export function appInfo (dispatch) {
  return function (message = '', opts = { decline: 'Ok'}, data = true) {
    return new Promise((resolve) => {
      dispatch(openDialog('info', message, data, opts, resolve))
    })
  }
}

/**
 * @see appInfo
 */
export function appError (dispatch) {
  return function (message = '', opts = { decline: 'Ok'}, data = true) {
    return new Promise((resolve) => {
      dispatch(openDialog('error', message, data, opts, resolve))
    })
  }
}

/**
 * @see appInfo
 */
export function appWarning (dispatch) {
  return function (message = '', opts = { decline: 'Ok'}, data = true) {
    return new Promise((resolve) => {
      dispatch(openDialog('warning', message, data, opts, resolve))
    })
  }
}

/**
 * Replaces window.confirm
 * @param message {string} Message to be shown in the dialog
 * @param option {object} Additional parameters
 * @returns {Promise}
 */
export function appConfirm (dispatch) {
  return function (message = '', opts = { accept: 'Confirm' }) {
    return new Promise((resolve, reject) => {
      dispatch(openDialog('confirm', message, true, opts, resolve, reject))
    })
  }
}

/**
 * Replaces window.prompt
 * @param message {string} Message to be shown in the dialog
 * @param option {object} Additional parameters
 * @returns {Promise}
 */
export function appPrompt (dispatch) {
  return function (message = '', defautValue = '', opts = { accept: 'Done' }) {
    return new Promise((resolve, reject) => {
      dispatch(openDialog('prompt', message, defautValue, opts, resolve, reject))
    })
  }
}
