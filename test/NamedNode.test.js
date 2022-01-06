import { strictEqual } from 'assert'
import { describe, it } from 'mocha'
import NamedNode from '../lib/NamedNode.js'

describe('NamedNode', () => {
  describe('.toCanonical', () => {
    it('should be a method', () => {
      const iri = 'http://example.org'
      const term = new NamedNode(iri)

      strictEqual(typeof term.toCanonical, 'function')
    })

    it('should return the IRI wrapped in angle brackets', () => {
      const iri = 'http://example.org'
      const term = new NamedNode(iri)

      strictEqual(term.toCanonical(), '<' + iri + '>')
    })
  })

  describe('.toString', () => {
    it('should be a method', () => {
      const iri = 'http://example.org'
      const term = new NamedNode(iri)

      strictEqual(typeof term.toString, 'function')
    })

    it('should return the IRI', () => {
      const iri = 'http://example.org'
      const term = new NamedNode(iri)

      strictEqual(term.toString(), iri)
    })
  })
})
