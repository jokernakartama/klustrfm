import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'

import filemanager from '~/ducks/fileManager'
import servicePanel from '~/ducks/servicePanel'

const rootReducer = combineReducers({
  filemanager,
  services: servicePanel
})

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk)
  )
  return store
}
