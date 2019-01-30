/* global describe, it */

const assert = require('assert')
const rdf = require('../lib/DataFactory')
const DatasetExt = require('../lib/Dataset')
const standard = require('@rdfjs/data-model/test')

describe('DataFactory', () => {
  describe('test suite', () => {
    standard(rdf)
  })

  describe('.defaults', () => {
    it('should contain objects and constructors for all data model objects', () => {
      assert.strictEqual(typeof rdf.defaults.defaultGraph, 'object')
      assert.strictEqual(typeof rdf.defaults.NamedNode, 'function')
      assert.strictEqual(typeof rdf.defaults.BlankNode, 'function')
      assert.strictEqual(typeof rdf.defaults.Literal, 'function')
      assert.strictEqual(typeof rdf.defaults.Variable, 'function')
      assert.strictEqual(typeof rdf.defaults.Quad, 'function')
      assert.strictEqual(typeof rdf.defaults.Dataset, 'function')
    })
  })

  describe('.namedNode', () => {
    describe('.toCanonical', () => {
      it('should be a method', () => {
        const iri = 'http://example.org'
        const term = rdf.namedNode(iri)

        assert.strictEqual(typeof term.toCanonical, 'function')
      })

      it('should return the IRI wrapped in angle brackets', () => {
        const iri = 'http://example.org'
        const term = rdf.namedNode(iri)

        assert.strictEqual(term.toCanonical(), '<' + iri + '>')
      })
    })

    describe('.toString', () => {
      it('should be a method', () => {
        const iri = 'http://example.org'
        const term = rdf.namedNode(iri)

        assert.strictEqual(typeof term.toString, 'function')
      })

      it('should return the IRI', () => {
        const iri = 'http://example.org'
        const term = rdf.namedNode(iri)

        assert.strictEqual(term.toString(), iri)
      })
    })

    describe('.toJSON', () => {
      it('should be a method', () => {
        const iri = 'http://example.org'
        const term = rdf.namedNode(iri)

        assert.strictEqual(typeof term.toJSON, 'function')
      })

      it('should return the JSON', () => {
        const iri = 'http://example.org'
        const term = rdf.namedNode(iri)

        assert.deepStrictEqual(term.toJSON(), { value: iri, termType: 'NamedNode' })
      })
    })
  })

  describe('.blankNode', () => {
    describe('.toCanonical', () => {
      it('should be a method', () => {
        const term = rdf.blankNode()

        assert.strictEqual(typeof term.toCanonical, 'function')
      })

      it('should return the identifier prefixed with "_:"', () => {
        const id = 'b1'
        const term = rdf.blankNode(id)

        assert.strictEqual(term.toCanonical(), '_:' + id)
      })
    })

    describe('.toString', () => {
      it('should be a method', () => {
        const term = rdf.blankNode()

        assert.strictEqual(typeof term.toString, 'function')
      })

      it('should return the identifier prefixed with "_:"', () => {
        const id = 'b1'
        const term = rdf.blankNode(id)

        assert.strictEqual(term.toString(), '_:' + id)
      })
    })

    describe('.toJSON', () => {
      it('should be a method', () => {
        const term = rdf.blankNode()

        assert.strictEqual(typeof term.toJSON, 'function')
      })

      it('should return the JSON with the identifier', () => {
        const id = 'b1'
        const term = rdf.blankNode(id)

        assert.deepStrictEqual(term.toJSON(), { value: id, termType: 'BlankNode' })
      })
    })
  })

  describe('.literal', () => {
    describe('.toCanonical', () => {
      it('should be a method', () => {
        const term = rdf.literal()

        assert.strictEqual(typeof term.toCanonical, 'function')
      })

      it('should return the string wrapped in double quotes', () => {
        const string = 'example'
        const term = rdf.literal(string)

        assert.strictEqual(term.toCanonical(), '"' + string + '"')
      })

      it('should support language literals', () => {
        const string = 'example'
        const language = 'en'
        const term = rdf.literal(string, language)

        assert.strictEqual(term.toCanonical(), '"' + string + '"@' + language)
      })

      it('should support datatype literals', () => {
        const string = 'example'
        const datatype = rdf.namedNode('http://example.org/datatype')
        const term = rdf.literal(string, datatype)

        assert.strictEqual(term.toCanonical(), '"' + string + '"^^<' + datatype.value + '>')
      })

      it('should escape special chars', () => {
        const quotationMarkTerm = rdf.literal('"')
        const backslashTerm = rdf.literal('\\')
        const lineFeedTerm = rdf.literal('\n')
        const carriageReturnTerm = rdf.literal('\r')

        assert.strictEqual(quotationMarkTerm.toCanonical(), '"\\""')
        assert.strictEqual(backslashTerm.toCanonical(), '"\\\\"')
        assert.strictEqual(lineFeedTerm.toCanonical(), '"\\n"')
        assert.strictEqual(carriageReturnTerm.toCanonical(), '"\\r"')
      })
    })

    describe('.toString', () => {
      it('should be a method', () => {
        const term = rdf.literal()

        assert.strictEqual(typeof term.toString, 'function')
      })

      it('should return the string', () => {
        const string = 'example'
        const term = rdf.literal(string)

        assert.strictEqual(term.toString(), string)
      })
    })

    describe('.toJSON', () => {
      it('should be a method', () => {
        const term = rdf.literal()

        assert.strictEqual(typeof term.toJSON, 'function')
      })

      it('should return the JSON', () => {
        const string = 'example'
        const lang = 'cs'
        const term = rdf.literal(string, lang)
        const expected = {
          'value': string,
          'termType': 'Literal',
          'language': lang,
          'datatype': {
            'termType': 'NamedNode',
            'value': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString'
          }
        }

        assert.deepStrictEqual(term.toJSON(), expected)
      })
    })
  })

  describe('.defaultGraph', () => {
    describe('.toCanonical', () => {
      it('should be a method', () => {
        const term = rdf.defaultGraph()

        assert.strictEqual(typeof term.toCanonical, 'function')
      })

      it('should return an empty string', () => {
        const term = rdf.defaultGraph()

        assert.strictEqual(term.toCanonical(), '')
      })
    })

    describe('.toString', () => {
      it('should be a method', () => {
        const term = rdf.defaultGraph()

        assert.strictEqual(typeof term.toString, 'function')
      })

      it('should return an empty string', () => {
        const term = rdf.defaultGraph()

        assert.strictEqual(term.toString(), '')
      })
    })

    describe('.toJSON', () => {
      it('should be a method', () => {
        const term = rdf.defaultGraph()

        assert.strictEqual(typeof term.toJSON, 'function')
      })

      it('should return the JSON', () => {
        const term = rdf.defaultGraph()

        assert.deepStrictEqual(term.toJSON(), { value: '', termType: 'DefaultGraph' })
      })
    })
  })

  describe('.variable', () => {
    describe('.toCanonical', () => {
      it('should be a method', () => {
        const term = rdf.variable('v')

        assert.strictEqual(typeof term.toCanonical, 'function')
      })

      it('should return the name prefixed with a question mark', () => {
        const name = 'v'
        const term = rdf.variable(name)

        assert.strictEqual(term.toCanonical(), '?' + name)
      })
    })

    describe('.toString', () => {
      it('should be a method', () => {
        const term = rdf.variable('v')

        assert.strictEqual(typeof term.toString, 'function')
      })

      it('should return the name prefixed with a question mark', () => {
        const name = 'v'
        const term = rdf.variable(name)

        assert.strictEqual(term.toString(), '?' + name)
      })
    })

    describe('.toJSON', () => {
      it('should be a method', () => {
        const term = rdf.variable('v')

        assert.strictEqual(typeof term.toJSON, 'function')
      })

      it('should return the JSON', () => {
        const name = 'v'
        const term = rdf.variable(name)

        assert.deepStrictEqual(term.toJSON(), { value: name, termType: 'Variable' })
      })
    })
  })

  describe('.quad', () => {
    describe('.toCanonical', () => {
      it('should return a canonical representation', () => {
        var subject = rdf.namedNode('http://example.org/subject')
        var predicate = rdf.namedNode('http://example.org/predicate')
        var object = rdf.namedNode('http://example.org/object')
        var graph = rdf.namedNode('http://example.org/graph')
        var quad = rdf.quad(subject, predicate, object, graph)

        assert.strictEqual(quad.toCanonical(), '<http://example.org/subject> <http://example.org/predicate> <http://example.org/object> <http://example.org/graph> .')
      })

      it('should skip the graph if it\'s a DefaultGraph', () => {
        var subject = rdf.namedNode('http://example.org/subject')
        var predicate = rdf.namedNode('http://example.org/predicate')
        var object = rdf.namedNode('http://example.org/object')
        var quad = rdf.quad(subject, predicate, object)

        assert.strictEqual(quad.toCanonical(), '<http://example.org/subject> <http://example.org/predicate> <http://example.org/object> .')
      })
    })

    describe('.toString', () => {
      it('should return a canonical representation', () => {
        var subject = rdf.namedNode('http://example.org/subject')
        var predicate = rdf.namedNode('http://example.org/predicate')
        var object = rdf.namedNode('http://example.org/object')
        var graph = rdf.namedNode('http://example.org/graph')
        var quad = rdf.quad(subject, predicate, object, graph)

        assert.strictEqual(quad.toString(), '<http://example.org/subject> <http://example.org/predicate> <http://example.org/object> <http://example.org/graph> .')
      })

      it('should skip the graph if it\'s a DefaultGraph', () => {
        var subject = rdf.namedNode('http://example.org/subject')
        var predicate = rdf.namedNode('http://example.org/predicate')
        var object = rdf.namedNode('http://example.org/object')
        var quad = rdf.quad(subject, predicate, object)

        assert.strictEqual(quad.toString(), '<http://example.org/subject> <http://example.org/predicate> <http://example.org/object> .')
      })
    })

    describe('.toJSON', () => {
      it('should be a method', () => {
        var subject = rdf.namedNode('http://example.org/subject')
        var predicate = rdf.namedNode('http://example.org/predicate')
        var object = rdf.namedNode('http://example.org/object')
        var graph = rdf.namedNode('http://example.org/graph')
        var quad = rdf.quad(subject, predicate, object, graph)

        assert.strictEqual(typeof quad.toJSON, 'function')
      })
      it('should return the JSON', () => {
        var subject = rdf.namedNode('http://example.org/subject')
        var predicate = rdf.namedNode('http://example.org/predicate')
        var object = rdf.namedNode('http://example.org/object')
        var graph = rdf.namedNode('http://example.org/graph')
        var quad = rdf.quad(subject, predicate, object, graph)

        assert.deepStrictEqual(quad.toJSON(), {
          subject: { value: 'http://example.org/subject', termType: 'NamedNode' },
          predicate: { value: 'http://example.org/predicate', termType: 'NamedNode' },
          object: { value: 'http://example.org/object', termType: 'NamedNode' },
          graph: { value: 'http://example.org/graph', termType: 'NamedNode' }
        })
      })
    })
  })

  describe('.graph', () => {
    it('should be a function', () => {
      assert.strictEqual(typeof rdf.graph, 'function')
    })

    it('should return an empty Dataset', () => {
      let dataset = rdf.graph()

      assert.strictEqual(dataset.length, 0)
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

      assert.strictEqual(dataset.length, 2)
      assert.strictEqual(dataset.match(null, null, triple1.object).length, 1)
      assert.strictEqual(dataset.match(null, null, triple2.object).length, 1)
    })
  })

  describe('.dataset', () => {
    it('should be a function', () => {
      assert.strictEqual(typeof rdf.dataset, 'function')
    })

    it('should return a DatasetExt instance', () => {
      assert.strictEqual(rdf.dataset() instanceof DatasetExt, true)
    })

    it('should always return a DatasetExt instance', () => {
      assert.strictEqual(rdf.dataset().clone() instanceof DatasetExt, true)
      assert.strictEqual(rdf.dataset().merge(rdf.dataset()) instanceof DatasetExt, true)
      assert.strictEqual(rdf.dataset().filter(() => true) instanceof DatasetExt, true)
    })

    describe('implements the extended Dataset interface', () => {
      it('should implement .equals', () => {
        const dataset = rdf.dataset()
        assert.strictEqual(typeof dataset.equals, 'function')
      })

      it('should implement .toCanonical', () => {
        const dataset = rdf.dataset()
        assert.strictEqual(typeof dataset.toCanonical, 'function')
      })

      it('should implement .toString', () => {
        const dataset = rdf.dataset()
        assert.strictEqual(typeof dataset.toString, 'function')
      })
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

      assert.strictEqual(dataset.length, 2)
      assert.strictEqual(dataset.match(null, null, quad1.object).length, 1)
      assert.strictEqual(dataset.match(null, null, quad2.object).length, 1)
      assert.strictEqual(dataset.match(null, null, null, quad1.graph).length, 2)
    })

    it('should replace the graph part of the quad if a second parameter is given', () => {
      let quad = rdf.quad(
        rdf.namedNode('http://example.org/subject'),
        rdf.namedNode('http://example.org/predicate'),
        rdf.literal('object1'),
        rdf.namedNode('http://example.org/graph'))

      let dataset = rdf.dataset([quad], rdf.namedNode('http://example.org/graph-replaced'))

      assert.strictEqual(dataset.length, 1)
      assert.strictEqual(dataset.toArray().shift().graph.value, 'http://example.org/graph-replaced')
    })

    describe('.equals', () => {
      it('should compare the other graph for equality', () => {
        let quad1a = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
          rdf.blankNode())

        let quad1b = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
          rdf.blankNode())

        let quad2 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
          rdf.literal('c'))

        let dataset1a = rdf.dataset([quad1a])
        let dataset1b = rdf.dataset([quad1b])
        let dataset2 = rdf.dataset([quad2])

        assert.strictEqual(dataset1a.equals(dataset1b), true)
        assert.strictEqual(dataset1a.equals(dataset2), false)
      })
    })

    describe('.toCanonical', () => {
      it('should return the canonical representation', () => {
        let quad = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
          rdf.blankNode())

        let dataset = rdf.dataset([quad])

        assert.strictEqual(dataset.toCanonical(), '<http://example.org/subject> <http://example.org/predicate> _:c14n0 .\n', true)
      })
    })

    describe('.toString', () => {
      it('should return N-Quads', () => {
        let quad = rdf.quad(
          rdf.namedNode('http://example.org/subject'),
          rdf.namedNode('http://example.org/predicate'),
          rdf.literal('object'),
          rdf.namedNode('http://example.org/graph'))

        let dataset = rdf.dataset([quad])

        assert.strictEqual(dataset.toString(), '<http://example.org/subject> <http://example.org/predicate> "object" <http://example.org/graph> .\n')
      })
    })

    describe('.toJSON', () => {
      it('should return the JSON', () => {
        let quad = rdf.quad(
          rdf.namedNode('http://example.org/subject'),
          rdf.namedNode('http://example.org/predicate'),
          rdf.literal('object'),
          rdf.namedNode('http://example.org/graph'))

        let dataset = rdf.dataset([ quad ])

        assert.deepStrictEqual(dataset.toJSON(), [
          {
            subject: { value: 'http://example.org/subject', termType: 'NamedNode' },
            predicate: { value: 'http://example.org/predicate', termType: 'NamedNode' },
            object: {
              value: 'object',
              termType: 'Literal',
              language: '',
              datatype: {
                value: 'http://www.w3.org/2001/XMLSchema#string', termType: 'NamedNode'
              }
            },
            graph: { value: 'http://example.org/graph', termType: 'NamedNode' }
          }
        ])
      })
    })
  })
})
