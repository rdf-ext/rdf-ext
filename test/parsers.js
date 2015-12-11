/* global describe, it */
var assert = require('assert')
var rdf = require('../rdf-ext')

module.exports = function () {
  describe('parsers', function () {
    it('should implement all required functions', function () {
      assert.equal(typeof rdf.Parsers.prototype.list, 'function')
      assert.equal(typeof rdf.Parsers.prototype.findParsers, 'function')
      assert.equal(typeof rdf.Parsers.prototype.parse, 'function')
      assert.equal(typeof rdf.Parsers.prototype.process, 'function')
      assert.equal(typeof rdf.Parsers.prototype.stream, 'function')
    })

    it('.list should return an array', function () {
      var mediaTypes = rdf.parsers.list()

      assert(Array.isArray(mediaTypes))
    })

    it('.findParsers should return null if no parser was found', function () {
      assert.equal(rdf.parsers.findParsers('image/jpeg'), null)
    })

    it('.parse should throw an error if no parser was found', function (done) {
      rdf.parsers.parse('image/jpeg', '').then(function () {
        done('no error thrown')
      }).catch(function () {
        done()
      })
    })

    it('.process should throw an error if no parser was found', function (done) {
      rdf.parsers.process('image/jpeg', '', function () {
      }).then(function () {
        done('no error thrown')
      }).catch(function () {
        done()
      })
    })

    it('.stream should return null if no parser was found', function () {
      assert.equal(rdf.parsers.stream('image/jpeg', ''), null)
    })
  })
}
