import { strictEqual } from 'assert'
import { describe, it } from 'mocha'
import Literal from '../lib/Literal.js'
import NamedNode from '../lib/NamedNode.js'

const langStringDatatype = new NamedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#langString')
const stringDatatype = new NamedNode('http://www.w3.org/2001/XMLSchema#string')

describe('Literal', () => {
  describe('.toCanonical', () => {
    it('should be a method', () => {
      const term = new Literal()

      strictEqual(typeof term.toCanonical, 'function')
    })

    it('should return the string wrapped in double quotes', () => {
      const string = 'example'
      const term = new Literal(string, null, stringDatatype)

      strictEqual(term.toCanonical(), '"' + string + '"')
    })

    it('should support language literals', () => {
      const string = 'example'
      const language = 'en'
      const term = new Literal(string, language, langStringDatatype)

      strictEqual(term.toCanonical(), '"' + string + '"@' + language)
    })

    it('should support datatype literals', () => {
      const string = 'example'
      const datatype = new NamedNode('http://example.org/datatype')
      const term = new Literal(string, null, datatype)

      strictEqual(term.toCanonical(), '"' + string + '"^^<' + datatype.value + '>')
    })

    it('should escape special chars', () => {
      const quotationMarkTerm = new Literal('"', null, stringDatatype)
      const backslashTerm = new Literal('\\', null, stringDatatype)
      const lineFeedTerm = new Literal('\n', null, stringDatatype)
      const carriageReturnTerm = new Literal('\r', null, stringDatatype)

      strictEqual(quotationMarkTerm.toCanonical(), '"\\""')
      strictEqual(backslashTerm.toCanonical(), '"\\\\"')
      strictEqual(lineFeedTerm.toCanonical(), '"\\n"')
      strictEqual(carriageReturnTerm.toCanonical(), '"\\r"')
    })
  })

  describe('.toString', () => {
    it('should be a method', () => {
      const term = new Literal()

      strictEqual(typeof term.toString, 'function')
    })

    it('should return the string', () => {
      const string = 'example'
      const term = new Literal(string, null, stringDatatype)

      strictEqual(term.toString(), string)
    })
  })
})
