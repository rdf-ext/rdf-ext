const assert = require('assert')
const { EventEmitter } = require('events')
const { describe, it } = require('mocha')
const { Parsers } = require('..')

describe('parsers', () => {
  it('should implement all required functions', function () {
    assert.strictEqual(typeof Parsers.prototype.find, 'function')
    assert.strictEqual(typeof Parsers.prototype.list, 'function')
    assert.strictEqual(typeof Parsers.prototype.import, 'function')
  })

  describe('.find', () => {
    it('should return null if no parser was found', function () {
      const parsers = new Parsers()

      assert.strictEqual(parsers.find('image/jpeg'), null)
    })

    it('should return the parser class for the given media type', function () {
      const jsonld = {}
      const turtle = {}

      const parsers = new Parsers({
        'application/ld+json': jsonld,
        'text/turtle': turtle
      })

      assert.strictEqual(parsers.find('text/turtle'), turtle)
    })
  })

  describe('.list', () => {
    it('should return an array', function () {
      const parsers = new Parsers()
      const mediaTypes = parsers.list()

      assert(Array.isArray(mediaTypes))
    })

    it('should return all media types', function () {
      const parsers = new Parsers({
        'application/ld+json': {},
        'text/turtle': {}
      })

      assert.deepStrictEqual(parsers.list(), ['application/ld+json', 'text/turtle'])
    })
  })

  describe('.import', () => {
    it('should return null if no parser was found', function () {
      const parsers = new Parsers()

      assert.strictEqual(parsers.import('image/jpeg', ''), null)
    })

    it('should call read on the parser class for the given media type', function () {
      let touched = false
      const jsonld = {}
      const turtle = new EventEmitter()

      turtle.import = () => {
        touched = true
      }

      const parsers = new Parsers({
        'application/ld+json': jsonld,
        'text/turtle': turtle
      })

      parsers.import('text/turtle')

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
