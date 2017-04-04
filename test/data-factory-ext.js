/* global describe, it */

const assert = require('assert')
const rdf = require('..')

describe('data-factory-ext', () => {
  describe('.defaults', () => {
    it('should container a Dataset constructor', () => {
      assert.equal(typeof rdf.defaults.Dataset, 'function')
    })
  })

  describe('.graph', () => {
    it('should be a function', () => {
      assert.equal(typeof rdf.graph, 'function')
    })

    it('should return an empty Dataset', () => {
      let dataset = rdf.graph()

      assert.equal(dataset.length, 0)
    })

    it('should initialize the Dataset with the given triples', () => {
      let triple1 = rdf.quad(
        rdf.namedNode('http://example.org/subject'),
        rdf.namedNode('http://example.org/predicate'),
        rdf.literal('object1'))

      let triple2 = rdf.quad(
        rdf.namedNode('http://example.org/subject'),
        rdf.namedNode('http://example.org/predicate'),
        rdf.literal('object2'))

      let dataset = rdf.graph([triple1, triple2])

      assert.equal(dataset.length, 2)
      assert.equal(dataset.match(null, null, triple1.object).length, 1)
      assert.equal(dataset.match(null, null, triple2.object).length, 1)
    })
  })

  describe('.dataset', () => {
    it('should be a function', () => {
      assert.equal(typeof rdf.dataset, 'function')
    })

    it('should initialize the Dataset with the given quads', () => {
      let quad1 = rdf.quad(
        rdf.namedNode('http://example.org/subject'),
        rdf.namedNode('http://example.org/predicate'),
        rdf.literal('object1'),
        rdf.namedNode('http://example.org/graph'))

      let quad2 = rdf.quad(
        rdf.namedNode('http://example.org/subject'),
        rdf.namedNode('http://example.org/predicate'),
        rdf.literal('object2'),
        rdf.namedNode('http://example.org/graph'))

      let dataset = rdf.dataset([quad1, quad2])

      assert.equal(dataset.length, 2)
      assert.equal(dataset.match(null, null, quad1.object).length, 1)
      assert.equal(dataset.match(null, null, quad2.object).length, 1)
      assert.equal(dataset.match(null, null, null, quad1.graph).length, 2)
    })

    it('should replace the graph part of the quad if a second parameter is given', () => {
      let quad = rdf.quad(
        rdf.namedNode('http://example.org/subject'),
        rdf.namedNode('http://example.org/predicate'),
        rdf.literal('object1'),
        rdf.namedNode('http://example.org/graph'))

      let dataset = rdf.dataset([quad], rdf.namedNode('http://example.org/graph-replaced'))

      assert.equal(dataset.length, 1)
      assert.equal(dataset.toArray().shift().graph.value, 'http://example.org/graph-replaced')
    })
  })
})
