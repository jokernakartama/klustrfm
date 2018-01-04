import getFileType from '../getFileType'
import { getFileExtention } from '../getFileType'

describe('utilitues/getFileType.js', function() {
  describe('getFileType', function() {
    it('should return file type', function () {
      expect(getFileType('somedata.zip')).to.equal('archive')
    })
  })

  describe('getFileExtention', function() {
    it('should return file extention with a dot', function () {
      expect(getFileExtention('unknown.file.ext')).to.equal('.ext')
    })
    it('should return file name if it has no dots in the name', function () {
      expect(getFileExtention('unknown')).to.equal('unknown')
    })
  })
})
