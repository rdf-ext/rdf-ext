const assert = require('assert')
const { EventEmitter } = require('events')
const { describe, it } = require('mocha')
const { Serializers } = require('..')

describe('serializers', () => {
  it('should implement all required functions', function () {
    assert.strictEqual(typeof Serializers.prototype.find, 'function')
    assert.strictEqual(typeof Serializers.prototype.list, 'function')
    assert.strictEqual(typeof Serializers.prototype.import, 'function')
  })

  describe('.find', () => {
    it('should return null if no serializer was found', function () {
      const serializers = new Serializers()

      assert.strictEqual(serializers.find('image/jpeg'), null)
    })

    it('should return the serializer class for the given media type', function () {
      const jsonld = {}
      const turtle = {}

      const serializer = new Serializers({
        'application/ld+json': jsonld,
        'text/turtle': turtle
      })

      assert.strictEqual(serializer.find('text/turtle'), turtle)
    })
  })

  describe('.list', () => {
    it('should return an array', function () {
      const serializers = new Serializers()
      const mediaTypes = serializers.list()

      assert(Array.isArray(mediaTypes))
    })

    it('should return all media types', function () {
      const serializers = new Serializers({
        'application/ld+json': {},
        'text/turtle': {}
      })

      assert.deepStrictEqual(serializers.list(), ['application/ld+json', 'text/turtle'])
    })
  })

  describe('.import', () => {
    it('should return null if no serializer was found', function () {
      const serializers = new Serializers()

      assert.strictEqual(serializers.import('image/jpeg', ''), null)
    })

    it('should call read on the serializer class for the given media type', function () {
      let touched = false
      const jsonld = {}
      const turtle = new EventEmitter()

      turtle.import = () => {
        touched = true
      }

      const serializers = new Serializers({
        'application/ld+json': jsonld,
        'text/turtle': turtle
      })

      serializers.import('text/turtle')

      const result = new Promise((resolve) => {
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
