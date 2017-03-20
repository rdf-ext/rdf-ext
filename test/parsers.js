/* global describe, it */

const assert = require('assert')
const EventEmitter = require('events').EventEmitter
const Parsers = require('..').Parsers

describe('parsers', () => {
  it('should implement all required functions', function () {
    assert.equal(typeof Parsers.prototype.find, 'function')
    assert.equal(typeof Parsers.prototype.list, 'function')
    assert.equal(typeof Parsers.prototype.import, 'function')
  })

  describe('.find', () => {
    it('should return null if no parser was found', function () {
      let parsers = new Parsers()

      assert.equal(parsers.find('image/jpeg'), null)
    })

    it('should return the parser class for the given media type', function () {
      let jsonld = {}
      let turtle = {}

      let parsers = new Parsers({
        'application/ld+json': jsonld,
        'text/turtle': turtle
      })

      assert.equal(parsers.find('text/turtle'), turtle)
    })
  })

  describe('.list', () => {
    it('should return an array', function () {
      let parsers = new Parsers()
      let mediaTypes = parsers.list()

      assert(Array.isArray(mediaTypes))
    })

    it('should return all media types', function () {
      let parsers = new Parsers({
        'application/ld+json': {},
        'text/turtle': {}
      })

      assert.deepEqual(parsers.list(), ['application/ld+json', 'text/turtle'])
    })
  })

  describe('.import', () => {
    it('should return null if no parser was found', function () {
      let parsers = new Parsers()

      assert.equal(parsers.import('image/jpeg', ''), null)
    })

    it('should call read on the parser class for the given media type', function () {
      let touched = false
      let jsonld = {}
      let turtle = new EventEmitter()

      turtle.import = () => {
        touched = true
      }

      let parsers = new Parsers({
        'application/ld+json': jsonld,
        'text/turtle': turtle
      })

      parsers.import('text/turtle')

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
