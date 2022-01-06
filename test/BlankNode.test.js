import { strictEqual } from 'assert'
import { describe, it } from 'mocha'
import BlankNode from '../lib/BlankNode.js'

describe('BlankNode', () => {
  describe('.toCanonical', () => {
    it('should be a method', () => {
      const term = new BlankNode()

      strictEqual(typeof term.toCanonical, 'function')
    })

    it('should return the identifier prefixed with "_:"', () => {
      const id = 'b1'
      const term = new BlankNode(id)

      strictEqual(term.toCanonical(), '_:' + id)
    })
  })

  describe('.toString', () => {
    it('should be a method', () => {
      const term = new BlankNode()

      strictEqual(typeof term.toString, 'function')
    })

    it('should return the identifier prefixed with "_:"', () => {
      const id = 'b1'
      const term = new BlankNode(id)

      strictEqual(term.toString(), '_:' + id)
    })
  })
})
