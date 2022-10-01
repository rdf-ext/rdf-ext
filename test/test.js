import { doesNotThrow, strictEqual } from 'assert'
import { describe, it } from 'mocha'
import rdf from '../index.js'

describe('rdf-ext', () => {
  it('should implement the ClownfaceFactory interface', () => {
    strictEqual(typeof rdf.clownface, 'function')
  })

  it('should implement the DataModelFactory interface', () => {
    strictEqual(typeof rdf.blankNode, 'function')
    strictEqual(typeof rdf.defaultGraph, 'function')
    strictEqual(typeof rdf.fromQuad, 'function')
    strictEqual(typeof rdf.fromTerm, 'function')
    strictEqual(typeof rdf.literal, 'function')
    strictEqual(typeof rdf.namedNode, 'function')
    strictEqual(typeof rdf.quad, 'function')
    strictEqual(typeof rdf.variable, 'function')
  })

  it('should implement the DatasetFactory interface', () => {
    strictEqual(typeof rdf.dataset, 'function')
  })

  it('should implement the FetchFactory interface', () => {
    strictEqual(typeof rdf.fetch, 'function')
  })

  it('should implement the FormatsFactory interface', () => {
    strictEqual(typeof rdf.formats, 'object')
  })

  it('should implement the NamespaceFactory interface', () => {
    strictEqual(typeof rdf.namespace, 'function')
  })

  it('should implement the PrefixMapFactory interface', () => {
    strictEqual(typeof rdf.prefixes, 'object')
    strictEqual(typeof rdf.prefixMap, 'function')
  })

  it('should implement the ScoreFactory interface', () => {
    strictEqual(typeof rdf.score, 'object')
    strictEqual(typeof rdf.score.sort, 'function')
  })

  it('should implement the TermMapFactory interface', () => {
    strictEqual(typeof rdf.termMap, 'function')
  })

  it('should implement the TermSetFactory interface', () => {
    strictEqual(typeof rdf.termSet, 'function')
  })

  it('should implement the TraverserFactory interface', () => {
    strictEqual(typeof rdf.traverser, 'function')
  })

  it('should bind the factory methods', () => {
    const { blankNode } = rdf

    doesNotThrow(() => {
      blankNode()
    })
  })
})
