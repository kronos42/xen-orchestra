'use strict'

// ===================================================================

var expect = require('must')

// ===================================================================

/* eslint-env mocha */

describe('fixUrl()', function () {
  var fixUrl = require('./fix-url')

  describe('protocol', function () {
    it('is added if missing', function () {
      expect(fixUrl('localhost/api/')).to.equal('ws://localhost/api/')
    })

    it('HTTP(s) is converted to WS(s)', function () {
      expect(fixUrl('http://localhost/api/')).to.equal('ws://localhost/api/')
      expect(fixUrl('https://localhost/api/')).to.equal('wss://localhost/api/')
    })

    it('is not added if already present', function () {
      expect(fixUrl('ws://localhost/api/')).to.equal('ws://localhost/api/')
      expect(fixUrl('wss://localhost/api/')).to.equal('wss://localhost/api/')
    })
  })

  describe('/api/ path', function () {
    it('is added if missing', function () {
      expect(fixUrl('ws://localhost')).to.equal('ws://localhost/api/')
      expect(fixUrl('ws://localhost/')).to.equal('ws://localhost/api/')
    })

    it('is not added if already present', function () {
      expect(fixUrl('ws://localhost/api/')).to.equal('ws://localhost/api/')
    })

    it('removes the hash part', function () {
      expect(fixUrl('ws://localhost/#foo')).to.equal('ws://localhost/api/')
    })

    it('conserve the search part', function () {
      expect(fixUrl('ws://localhost/?foo')).to.equal('ws://localhost/api/?foo')
    })
  })
})