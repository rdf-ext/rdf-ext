import { strictEqual } from 'assert'
import { describe, it } from 'mocha'
import Quad from '../lib/Quad.js'
import example from './support/exampleData.js'

describe('Quad', () => {
  describe('.toCanonical', () => {
    it('should return a canonical representation', () => {
      const quad = new Quad(example.subject, example.predicate, example.object, example.graph)
      const quadNT = `${example.subject.toCanonical()} ${example.predicate.toCanonical()} ${example.object.toCanonical()} ${example.graph.toCanonical()} .`

      strictEqual(quad.toCanonical(), quadNT)
    })

    it('should skip the graph if it\'s a DefaultGraph', () => {
      const quad = new Quad(example.subject, example.predicate, example.object)
      const quadNT = `${example.subject.toCanonical()} ${example.predicate.toCanonical()} ${example.object.toCanonical()} .`

      strictEqual(quad.toCanonical(), quadNT)
    })
  })

  describe('.toString', () => {
    it('should return a canonical representation', () => {
      const quad = new Quad(example.subject, example.predicate, example.object, example.graph)
      const quadNT = `${example.subject.toCanonical()} ${example.predicate.toCanonical()} ${example.object.toCanonical()} ${example.graph.toCanonical()} .`

      strictEqual(quad.toString(), quadNT)
    })

    it('should skip the graph if it\'s a DefaultGraph', () => {
      const quad = new Quad(example.subject, example.predicate, example.object)
      const quadNT = `${example.subject.toCanonical()} ${example.predicate.toCanonical()} ${example.object.toCanonical()} .`

      strictEqual(quad.toString(), quadNT)
    })
  })
})
