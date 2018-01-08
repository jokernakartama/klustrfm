import * as dux from '../fileManager'
import reducer from '../fileManager'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const createStore = configureStore([thunk])

describe('ducks/fileManager.js', function() {

  describe('requestStart', function() {
    it('should create an action to start request', function () {
      const expected = {
        type: dux.REQUEST_START
      }
      expect(dux.requestStart()).to.deep.equal(expected)
    })
  })
  
  describe('requestEnd', function() {
    it('should create an action to end a request', function () {
      const expected = {
        type: dux.REQUEST_END
      }
      expect(dux.requestEnd()).to.deep.equal(expected)
    })
  })
  
  describe('resourcePatchStart', function() {
    it('should create an action to start resource patch', function () {
      const expected = {
        type: dux.RESOURCE_PATCH_START
      }
      expect(dux.resourcePatchStart()).to.deep.equal(expected)
    })
  })

  describe('resourcePatchEnd', function() {
    it('should create an action to end resource patch', function () {
      const expected = {
        type: dux.RESOURCE_PATCH_END
      }
      expect(dux.resourcePatchEnd()).to.deep.equal(expected)
    })
  })

  describe('directoryUpdate', function() {
    it('should create an action to update the directory data', function () {
      const data = {
        current: {
          name: 'anydir'
        },
        resources: {
          'res1': { name: 'child-dir' },
          'res2': { name: 'child-file' }
        }
      }
      const expected = {
        type: dux.DIRECTORY_UPDATE,
        payload: {
          current: data.current,
          resources: data.resources,
        }
      }
      expect(dux.directoryUpdate(data)).to.deep.equal(expected)
    })
  })

  describe('directoryUnavailable', function() {
    it('should create an action "directory unavailable"', function () {
      const expected = {
        type: dux.DIRECTORY_UNAVAILABLE
      }
      expect(dux.directoryUnavailable()).to.deep.equal(expected)
    })
  })

  describe('switchService', function() {
    it('should create an action to update the service name and the path', function () {
      const data = {
        service: 'anyservicename',
        path: 'any-dir/any-nested-dir',
        isTrash: false
      }
      const expected = {
        type: dux.SERVICE_SWITCHED,
        payload: {
          service: data.service,
          path: data.path,
          isTrash: data.isTrash
        }
      }
      expect(dux.switchService(data)).to.deep.equal(expected)
    })
  })

  describe('selectResource', function() {
    it('should create an action to select a resource', function () {
      const id = '1337'
      const expected = {
        type: dux.RESOURCE_SELECT,
        payload: id
      }
      expect(dux.selectResource(id)).to.deep.equal(expected)
    })
  })

  describe('deselectResource', function() {
    it('should dispatch selectResource with an argument "false"', function () {
      const store = createStore({yap: 'tnjoe'})
      const actions = store.getActions()
      store.dispatch(dux.deselectResource())
      const expected = {
        type: dux.RESOURCE_SELECT,
        payload: false
      }
      expect(actions[0]).to.deep.equal(expected)
    })
  })

  describe('updateResource', function() {
    it('should create an action to update a resource data', function () {
      const data = {
        id: '1337',
        value: { publicLink: null }
      }
      const expected = {
        type: dux.RESOURCE_UPDATE,
        payload: {
          id: data.id,
          value: data.value
        }
      }
      expect(dux.updateResource(data)).to.deep.equal(expected)
    })
  })

  describe('parseLocation', function() {
    it('1. should clean errors', function () {
      const store = createStore({})
      const actions = store.getActions()
      store.dispatch(dux.parseLocation('/disk:trash/child-dir'))
      const expected = {
        type: dux.ERROR_RECIEVED,
        payload: null
      }
      expect(actions[0]).to.deep.equal(expected)
    })
    
    it('2. should throw a routing error if recieves not a string', function () {
      const store = createStore({})
      const actions = store.getActions()
      store.dispatch(dux.parseLocation({ location: 'not-a-string' }))
      const expected = {
        type: dux.ERROR_RECIEVED,
        payload: 0
      }
      expect(actions[1]).to.deep.equal(expected)
    })
    
    it('3. should clean directory data if service has switched', function () {
      const store = createStore({})
      const state = store.getState()
      const actions = store.getActions()
      store.dispatch(dux.parseLocation('/disk:trash/child-dir', 'cloudspace'))
      const expected = {
        type: dux.DIRECTORY_UNAVAILABLE
      }
      expect(actions[1]).to.deep.equal(expected)
    })
  })

  describe('sortResourcesList', function() {
    it('should create an action to set sorting data', function () {
      const field = 'size'
      const asc = false
      const expected = {
        type: dux.DIRECTORY_RESOURCES_SORT,
        payload: {
          field,
          asc
        }
      }
      expect(dux.sortResourcesList(field, asc)).to.deep.equal(expected)
    })
  })

  describe('fileManager reducer', function() {
    it('1. should return initial state', function () {      
      expect(reducer()).to.deep.equal(dux.initialState)
    })

    describe('2. should handle actions', function() {
      it('SERVICE_SWITCHED', function () {      
        this.skip()
      })
      
      it('DIRECTORY_LOADING_START', function () {      
        this.skip()
      })
      
      it('DIRECTORY_LOADING_END', function () {      
        this.skip()
      })
      
      it('DIRECTORY_UPDATE', function () {      
        this.skip()
      })
      
      it('DIRECTORY_UNAVAILABLE', function () {      
        this.skip()
      })
      
      it('DIRECTORY_RESOURCES_SORT', function () {      
        this.skip()
      })
      
      it('RESOURCE_PATCH_START', function () {      
        this.skip()
      })
      
      it('RESOURCE_PATCH_END', function () {      
        this.skip()
      })
      
      it('RESOURCE_UPDATE', function () {      
        this.skip()
      })
      
      it('RESOURCE_SELECT', function () {      
        this.skip()
      })
    })
  })

})
