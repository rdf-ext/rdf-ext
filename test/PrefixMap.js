/* global describe, it */

const assert = require('assert')
const DataFactory = require('../lib/DataFactory')
const EventEmitter = require('events').EventEmitter
const PrefixMap = require('../lib/PrefixMap')

describe('PrefixMap', function () {
  it('should have all required functions and properties', () => {
    const prefixes = new PrefixMap(DataFactory)

    assert.strictEqual(typeof prefixes.addAll, 'function')
    assert.strictEqual(typeof prefixes.clone, 'function')
    assert.strictEqual(typeof prefixes.map, 'object')
    assert.strictEqual(typeof prefixes.resolve, 'function')
    assert.strictEqual(typeof prefixes.shrink, 'function')
  })

  it('the constructor should add all given prefixes', () => {
    const prefixes = new PrefixMap(DataFactory, {
      ex1: 'http://example.org/1/',
      ex2: 'http://example.org/2/'
    })

    assert.strictEqual(prefixes.map.ex1.value, 'http://example.org/1/')
    assert.strictEqual(prefixes.map.ex2.value, 'http://example.org/2/')
  })

  it('.addAll should add multiple prefixes', () => {
    const prefixes = new PrefixMap(DataFactory)

    prefixes.addAll({
      ex1: 'http://example.org/1/',
      ex2: 'http://example.org/2/'
    })

    assert.strictEqual(prefixes.map.ex1.value, 'http://example.org/1/')
    assert.strictEqual(prefixes.map.ex2.value, 'http://example.org/2/')
  })

  it('.addAll should return the PrefixMap instance', () => {
    const prefixes = new PrefixMap(DataFactory)

    const result = prefixes.addAll({
      ex1: 'http://example.org/1/',
      ex2: 'http://example.org/2/'
    })

    assert.strictEqual(result, prefixes)
  })

  it('.clone should create a new instance and copy all prefixes', () => {
    const prefixes = new PrefixMap(DataFactory, {
      ex1: 'http://example.org/1/',
      ex2: 'http://example.org/2/'
    })

    const clone = prefixes.clone()

    assert.notStrictEqual(clone, prefixes)
    assert.strictEqual(clone.map.ex1.value, 'http://example.org/1/')
    assert.strictEqual(clone.map.ex2.value, 'http://example.org/2/')
  })

  it('.resolve should expand a CURIE string', () => {
    const prefixes = new PrefixMap(DataFactory, { ex: 'http://example.org/' })

    const expanded = prefixes.resolve('ex:test')

    assert.strictEqual(expanded.termType, 'NamedNode')
    assert.strictEqual(expanded.value, 'http://example.org/test')
  })

  it('.resolve should expand a CURIE NamedNode', () => {
    const prefixes = new PrefixMap(DataFactory, { ex: 'http://example.org/' })

    const expanded = prefixes.resolve(DataFactory.namedNode('ex:test'))

    assert.strictEqual(expanded.value, 'http://example.org/test')
  })

  it('.resolve should return null if it\'s already an URL', () => {
    const prefixes = new PrefixMap(DataFactory, { ex: 'http://example.org/' })

    const expanded = prefixes.resolve('http://example.org/test')

    assert.strictEqual(expanded, null)
  })

  it('.resolve should return null if no prefix separator was found', () => {
    const prefixes = new PrefixMap(DataFactory, { ex: 'http://example.org/' })

    const expanded = prefixes.resolve('ex')

    assert.strictEqual(expanded, null)
  })

  it('.resolve should return null if the prefix can\'t be found', () => {
    const prefixes = new PrefixMap(DataFactory, { ex: 'http://example.org/' })

    const expanded = prefixes.resolve('ex1:test')

    assert.strictEqual(expanded, null)
  })

  it('.shrink should compact a string', () => {
    const prefixes = new PrefixMap(DataFactory, { ex: 'http://example.org/' })

    const shrinked = prefixes.shrink('http://example.org/test')

    assert.strictEqual(shrinked.termType, 'NamedNode')
    assert.strictEqual(shrinked.value, 'ex:test')
  })

  it('.shrink should compact a NamedNode', () => {
    const prefixes = new PrefixMap(DataFactory, { ex: 'http://example.org/' })

    const shrinked = prefixes.shrink(DataFactory.namedNode('http://example.org/test'))

    assert.strictEqual(shrinked.termType, 'NamedNode')
    assert.strictEqual(shrinked.value, 'ex:test')
  })

  it('.shrink should return null if no matching prefix was found', () => {
    const prefixes = new PrefixMap(DataFactory, { ex: 'http://example.org/' })

    const shrinked = prefixes.shrink('http://example.com/test')

    assert.strictEqual(shrinked, null)
  })

  it('.import should import prefixes from a stream', () => {
    const stream = new EventEmitter()

    const prefixes = new PrefixMap(DataFactory)

    const result = prefixes.import(stream).then(() => {
      assert.strictEqual(prefixes.map.ex1.value, 'http://example.org/1')
      assert.strictEqual(prefixes.map.ex2.value, 'http://example.org/2')
    })

    stream.emit('prefix', 'ex1', DataFactory.namedNode('http://example.org/1'))
    stream.emit('prefix', 'ex2', DataFactory.namedNode('http://example.org/2'))
    stream.emit('end')

    return result
  })

  it('.export should export prefixes to a stream', () => {
    const stream = new EventEmitter()

    const prefixes = new PrefixMap(DataFactory, {
      ex1: 'http://example.org/1/',
      ex2: 'http://example.org/2/'
    })

    const result = {}

    return new Promise((resolve) => {
      stream.on('prefix', (prefix, namespace) => {
        result[prefix] = namespace.value

        if (Object.keys(result).length === 2) {
          assert.strictEqual(result.ex1, 'http://example.org/1/')
          assert.strictEqual(result.ex2, 'http://example.org/2/')

          resolve()
        }
      })

      prefixes.export(stream)
    })
  })
})
