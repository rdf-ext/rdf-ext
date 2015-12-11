/* global describe, it */
var assert = require('assert')
var rdf = require('../rdf-ext')

module.exports = function () {
  describe('serializers', function () {
    it('should implement all required functions', function () {
      assert.equal(typeof rdf.Serializers.prototype.list, 'function')
      assert.equal(typeof rdf.Serializers.prototype.findSerializer, 'function')
      assert.equal(typeof rdf.Serializers.prototype.serialize, 'function')
      assert.equal(typeof rdf.Serializers.prototype.stream, 'function')
    })

    it('.list should return an array', function () {
      var mediaTypes = rdf.serializers.list()

      assert(Array.isArray(mediaTypes))
    })

    it('.findSerializer should return null if no serializer was found', function () {
      assert.equal(rdf.serializers.findSerializer('image/jpeg'), null)
    })

    it('.serialize should throw an error if no serializer was found', function (done) {
      rdf.serializers.serialize('image/jpeg', {}).then(function () {
        done('no error throw')
      }).catch(function () {
        done()
      })
    })

    it('.stream should return null if no serializer was found', function () {
      assert.equal(rdf.serializers.stream('image/jpeg'), null)
    })
  })
}
