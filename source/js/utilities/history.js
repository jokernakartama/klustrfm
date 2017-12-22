import { createBrowserHistory, createHashHistory } from 'history'

const APPLICATION_SERVER_DIRECTORY = '/'
const USE_BROWSER_HISTORY = true

export var history = USE_BROWSER_HISTORY ? createBrowserHistory({ basename: APPLICATION_SERVER_DIRECTORY }) : createHashHistory()
