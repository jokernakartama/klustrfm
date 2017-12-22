import AX from '../ajax.js'
import { urlStr } from '../ajax.js'

describe('utilitues/ajax.js', function() {
  describe('AX', function() {
    it('should return instance after calling any method', function () {
      expect(AX.get('http://url.com')).to.be.an.instanceof(AX)
    })
  })

  describe('urlStr', function() {
    it('should return string', function () {
      var urlEncodedString = urlStr({a:1, b:2})
      expect(urlEncodedString).to.be.a('string')
    })
  })
})

