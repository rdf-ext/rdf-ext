import { strictEqual } from 'assert'
import { describe, it } from 'mocha'
import DefaultGraph from '../lib/DefaultGraph.js'

describe('DefaultGraph', () => {
  describe('.toCanonical', () => {
    it('should be a method', () => {
      const term = new DefaultGraph()

      strictEqual(typeof term.toCanonical, 'function')
    })

    it('should return an empty string', () => {
      const term = new DefaultGraph()

      strictEqual(term.toCanonical(), '')
    })
  })

  describe('.toString', () => {
    it('should be a method', () => {
      const term = new DefaultGraph()

      strictEqual(typeof term.toString, 'function')
    })

    it('should return an empty string', () => {
      const term = new DefaultGraph()

      strictEqual(term.toString(), '')
    })
  })
})
