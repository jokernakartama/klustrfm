import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunk from 'redux-thunk'

import filemanager from '~/ducks/fileManager'
import servicePanel from '~/ducks/servicePanel'
import modal from '~/ducks/modal'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const rootReducer = combineReducers({
  filemanager,
  services: servicePanel,
  modal
})

export function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(thunk)
    )
  )
  return store
}

const store = configureStore()

export function dispatch (action) {
  store.dispatch(action)
}

export default store
