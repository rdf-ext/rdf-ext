/* global describe, it */

const assert = require('assert')
const EventEmitter = require('events').EventEmitter
const Serializers = require('..').Serializers

describe('serializers', () => {
  it('should implement all required functions', function () {
    assert.strictEqual(typeof Serializers.prototype.find, 'function')
    assert.strictEqual(typeof Serializers.prototype.list, 'function')
    assert.strictEqual(typeof Serializers.prototype.import, 'function')
  })

  describe('.find', () => {
    it('should return null if no serializer was found', function () {
      let serializers = new Serializers()

      assert.strictEqual(serializers.find('image/jpeg'), null)
    })

    it('should return the serializer class for the given media type', function () {
      let jsonld = {}
      let turtle = {}

      let serializer = new Serializers({
        'application/ld+json': jsonld,
        'text/turtle': turtle
      })

      assert.strictEqual(serializer.find('text/turtle'), turtle)
    })
  })

  describe('.list', () => {
    it('should return an array', function () {
      let serializers = new Serializers()
      let mediaTypes = serializers.list()

      assert(Array.isArray(mediaTypes))
    })

    it('should return all media types', function () {
      let serializers = new Serializers({
        'application/ld+json': {},
        'text/turtle': {}
      })

      assert.deepStrictEqual(serializers.list(), ['application/ld+json', 'text/turtle'])
    })
  })

  describe('.import', () => {
    it('should return null if no serializer was found', function () {
      let serializers = new Serializers()

      assert.strictEqual(serializers.import('image/jpeg', ''), null)
    })

    it('should call read on the serializer class for the given media type', function () {
      let touched = false
      let jsonld = {}
      let turtle = new EventEmitter()

      turtle.import = () => {
        touched = true
      }

      let serializers = new Serializers({
        'application/ld+json': jsonld,
        'text/turtle': turtle
      })

      serializers.import('text/turtle')

      let result = new Promise((resolve) => {
        turtle.on('end', () => {
          assert(touched)

          resolve()
        })
      })

      turtle.emit('end')

      return result
    })
  })
})
