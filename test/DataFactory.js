/* global describe, it */

const assert = require('assert')
const rdf = require('../lib/DataFactory')
const standard = require('rdf-data-model/test')

describe('DataFactory', () => {
  describe('test suite', () => {
    standard(rdf)
  })

  describe('.defaults', () => {
    it('should contain objects and constructors for all data model objects', () => {
      assert.equal(typeof rdf.defaults.defaultGraph, 'object')
      assert.equal(typeof rdf.defaults.NamedNode, 'function')
      assert.equal(typeof rdf.defaults.BlankNode, 'function')
      assert.equal(typeof rdf.defaults.Literal, 'function')
      assert.equal(typeof rdf.defaults.Variable, 'function')
      assert.equal(typeof rdf.defaults.Quad, 'function')
      assert.equal(typeof rdf.defaults.Dataset, 'function')
    })
  })

  describe('.namedNode', () => {
    describe('.toCanonical', () => {
      it('should be a method', () => {
        const iri = 'http://example.org'
        const term = rdf.namedNode(iri)

        assert.equal(typeof term.toCanonical, 'function')
      })

      it('should return the IRI wrapped in angle brackets', () => {
        const iri = 'http://example.org'
        const term = rdf.namedNode(iri)

        assert.equal(term.toCanonical(), '<' + iri + '>')
      })
    })

    describe('.toString', () => {
      it('should be a method', () => {
        const iri = 'http://example.org'
        const term = rdf.namedNode(iri)

        assert.equal(typeof term.toString, 'function')
      })

      it('should return the IRI', () => {
        const iri = 'http://example.org'
        const term = rdf.namedNode(iri)

        assert.equal(term.toString(), iri)
      })
    })
  })

  describe('.blankNode', () => {
    describe('.toCanonical', () => {
      it('should be a method', () => {
        const term = rdf.blankNode()

        assert.equal(typeof term.toCanonical, 'function')
      })

      it('should return the identifier prefixed with "_:"', () => {
        const id = 'b1'
        const term = rdf.blankNode(id)

        assert.equal(term.toCanonical(), '_:' + id)
      })
    })

    describe('.toString', () => {
      it('should be a method', () => {
        const term = rdf.blankNode()

        assert.equal(typeof term.toString, 'function')
      })

      it('should return the identifier prefixed with "_:"', () => {
        const id = 'b1'
        const term = rdf.blankNode(id)

        assert.equal(term.toString(), '_:' + id)
      })
    })
  })

  describe('.literal', () => {
    describe('.toCanonical', () => {
      it('should be a method', () => {
        const term = rdf.literal()

        assert.equal(typeof term.toCanonical, 'function')
      })

      it('should return the string wrapped in double quotes', () => {
        const string = 'example'
        const term = rdf.literal(string)

        assert.equal(term.toCanonical(), '"' + string + '"')
      })
    })

    describe('.toString', () => {
      it('should be a method', () => {
        const term = rdf.literal()

        assert.equal(typeof term.toString, 'function')
      })

      it('should return the string', () => {
        const string = 'example'
        const term = rdf.literal(string)

        assert.equal(term.toString(), string)
      })
    })
  })

  describe('.defaultGraph', () => {
    describe('.toCanonical', () => {
      it('should be a method', () => {
        const term = rdf.defaultGraph()

        assert.equal(typeof term.toCanonical, 'function')
      })

      it('should return an empty string', () => {
        const term = rdf.defaultGraph()

        assert.equal(term.toCanonical(), '')
      })
    })

    describe('.toString', () => {
      it('should be a method', () => {
        const term = rdf.defaultGraph()

        assert.equal(typeof term.toString, 'function')
      })

      it('should return an empty string', () => {
        const term = rdf.defaultGraph()

        assert.equal(term.toString(), '')
      })
    })
  })

  describe('.variable', () => {
    describe('.toCanonical', () => {
      it('should be a method', () => {
        const term = rdf.variable('v')

        assert.equal(typeof term.toCanonical, 'function')
      })

      it('should return the name prefixed with a question mark', () => {
        const name = 'v'
        const term = rdf.variable(name)

        assert.equal(term.toCanonical(), '?' + name)
      })
    })

    describe('.toString', () => {
      it('should be a method', () => {
        const term = rdf.variable('v')

        assert.equal(typeof term.toString, 'function')
      })

      it('should return the name prefixed with a question mark', () => {
        const name = 'v'
        const term = rdf.variable(name)

        assert.equal(term.toString(), '?' + name)
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

        assert.equal(quad.toCanonical(), '<http://example.org/subject> <http://example.org/predicate> <http://example.org/object> <http://example.org/graph> .')
      })

      it('should skip the graph if it\'s a DefaultGraph', () => {
        var subject = rdf.namedNode('http://example.org/subject')
        var predicate = rdf.namedNode('http://example.org/predicate')
        var object = rdf.namedNode('http://example.org/object')
        var quad = rdf.quad(subject, predicate, object)

        assert.equal(quad.toCanonical(), '<http://example.org/subject> <http://example.org/predicate> <http://example.org/object> .')
      })
    })

    describe('.toString', () => {
      it('should return a canonical representation', () => {
        var subject = rdf.namedNode('http://example.org/subject')
        var predicate = rdf.namedNode('http://example.org/predicate')
        var object = rdf.namedNode('http://example.org/object')
        var graph = rdf.namedNode('http://example.org/graph')
        var quad = rdf.quad(subject, predicate, object, graph)

        assert.equal(quad.toString(), '<http://example.org/subject> <http://example.org/predicate> <http://example.org/object> <http://example.org/graph> .')
      })

      it('should skip the graph if it\'s a DefaultGraph', () => {
        var subject = rdf.namedNode('http://example.org/subject')
        var predicate = rdf.namedNode('http://example.org/predicate')
        var object = rdf.namedNode('http://example.org/object')
        var quad = rdf.quad(subject, predicate, object)

        assert.equal(quad.toString(), '<http://example.org/subject> <http://example.org/predicate> <http://example.org/object> .')
      })
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

    it('should implement the extended Dataset interface', () => {
      let dataset = rdf.dataset()

      assert.equal(typeof dataset.equals, 'function')
      assert.equal(typeof dataset.toCanonical, 'function')
      assert.equal(typeof dataset.toString, 'function')
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

        assert.equal(dataset1a.equals(dataset1b), true)
        assert.equal(dataset1a.equals(dataset2), false)
      })
    })

    describe('.toCanonical', () => {
      it('should return the canonical representation', () => {
        let quad = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
          rdf.blankNode())

        let dataset = rdf.dataset([quad])

        assert.equal(dataset.toCanonical(), '<http://example.org/subject> <http://example.org/predicate> _:c14n0 .\n', true)
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

        assert.equal(dataset.toString(), '<http://example.org/subject> <http://example.org/predicate> "object" <http://example.org/graph> .\n')
      })
    })
  })
})
