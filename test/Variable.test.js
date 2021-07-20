import { strictEqual } from 'assert'
import { describe, it } from 'mocha'
import Variable from '../lib/Variable.js'

describe('Variable', () => {
  describe('.toCanonical', () => {
    it('should be a method', () => {
      const term = new Variable('v')

      strictEqual(typeof term.toCanonical, 'function')
    })

    it('should return the name prefixed with a question mark', () => {
      const name = 'v'
      const term = new Variable(name)

      strictEqual(term.toCanonical(), '?' + name)
    })
  })

  describe('.toString', () => {
    it('should be a method', () => {
      const term = new Variable('v')

      strictEqual(typeof term.toString, 'function')
    })

    it('should return the name prefixed with a question mark', () => {
      const name = 'v'
      const term = new Variable(name)

      strictEqual(term.toString(), '?' + name)
    })
  })
})
