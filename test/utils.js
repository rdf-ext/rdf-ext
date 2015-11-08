/* global before, describe, it */
var assert = require('assert')
var rdf = require('../rdf-ext')
var testData = require('rdf-test-data')

module.exports = function (ctx) {
  describe('utils', function () {
    var tbbtGraph

    before(function (done) {
      testData.tbbtGraph().then(function (graph) {
        tbbtGraph = graph

        done()
      }).catch(function (error) {
        done(error)
      })
    })

    describe('defaultRequest', function () {
      if (typeof process !== 'undefined' && process.versions && process.versions.node) {
        var nock = require('nock')

        it('should support method, url, headers, content interface', function (done) {
          var sentHeaders
          var sentData

          nock('http://example.org')
            .post('/resource')
            .reply(200, function (iri, body) {
              sentHeaders = this.req.headers
              sentContent = body

              return 'response'
            })

          rdf.defaultRequest(
            'POST',
            'http://example.org/resource',
            {'Accept': 'text/plain'},
            'request',
            function (statusCode, headers, content) {
              assert.equal(statusCode, 200)
              assert.deepEqual(headers, {})
              assert.equal(content, 'response')
              assert.equal(sentHeaders.accept, 'text/plain')
              assert.equal(sentContent, 'request')

              done()
          })
        })

        it('should support request module compatible interface', function (done) {
          var sentHeaders
          var sentContent

          nock('http://example.org')
            .post('/resource')
            .reply(200, function (iri, body) {
              sentHeaders = this.req.headers
              sentContent = body

              return 'response'
            })

          rdf.defaultRequest({
            method: 'POST',
            url: 'http://example.org/resource',
            headers: {'Accept': 'text/plain'},
            body: 'request'
          }, function (statusCode, headers, content) {
            assert.equal(statusCode, 200)
            assert.deepEqual(headers, {})
            assert.equal(content, 'response')
            assert.equal(sentHeaders.accept, 'text/plain')
            assert.equal(sentContent, 'request')

            done()
          })
        })

        it('should return a Promise', function (done) {
          var sentHeaders
          var sentContent

          nock('http://example.org')
            .post('/resource')
            .reply(200, function (iri, body) {
              sentHeaders = this.req.headers
              sentContent = body

              return 'response'
            })

          rdf.defaultRequest({
            method: 'POST',
            url: 'http://example.org/resource',
            headers: {'Accept': 'text/plain'},
            body: 'request'
          }).then(function (result) {
            assert.equal(result.statusCode, 200)
            assert.deepEqual(result.headers, {})
            assert.equal(result.content, 'response')
            assert.equal(sentHeaders.accept, 'text/plain')
            assert.equal(sentContent, 'request')

            done()
          }).catch(function (error) {
            done(error)
          })
        })
      } else {
        //TODO: implement browser defaultRequest test
      }
    })

    describe('filter', function () {
      it('namedNode should filter NamedNode nodes', function () {
        assert.equal(rdf.utils.filter.namedNode(rdf.createNamedNode('http://example.org')), true)
        assert.equal(rdf.utils.filter.namedNode(rdf.createBlankNode()), false)
        assert.equal(rdf.utils.filter.namedNode(rdf.createLiteral('test')), false)
      })

      it('blankNode should filter BlankNode nodes', function () {
        assert.equal(rdf.utils.filter.blankNode(rdf.createNamedNode('http://example.org')), false)
        assert.equal(rdf.utils.filter.blankNode(rdf.createBlankNode()), true)
        assert.equal(rdf.utils.filter.blankNode(rdf.createLiteral('test')), false)
      })

      it('literal should filter Literal nodes', function () {
        assert.equal(rdf.utils.filter.literal(rdf.createNamedNode('http://example.org')), false)
        assert.equal(rdf.utils.filter.literal(rdf.createBlankNode()), false)
        assert.equal(rdf.utils.filter.literal(rdf.createLiteral('test')), true)
      })

      it('namedNodeSubject should exclude NamedNodes with different subject', function () {
        var blankNodeTriple = rdf.createTriple(
          rdf.createBlankNode(),
          rdf.createNamedNode('http://example.org'),
          rdf.createLiteral('test'))

        var subject = rdf.createNamedNode('http://example.org/subject')

        var sameSubjectTriple = rdf.createTriple(
          subject,
          rdf.createNamedNode('http://example.org'),
          rdf.createLiteral('test'))

        var otherSubjectTriple = rdf.createTriple(
          rdf.createNamedNode('http://example.org/otherSubject'),
          rdf.createNamedNode('http://example.org'),
          rdf.createLiteral('test'))

        assert.equal(rdf.utils.filter.namedNodeSubject(subject)(blankNodeTriple), true)
        assert.equal(rdf.utils.filter.namedNodeSubject(subject)(sameSubjectTriple), true)
        assert.equal(rdf.utils.filter.namedNodeSubject(subject)(otherSubjectTriple), false)
      })
    })

    describe('list', function () {
      it('should list subjects', function () {
        var subject = rdf.createNamedNode('http://localhost:8080/data/person/amy-farrah-fowler')
        var subjects = rdf.utils.list.subjects(tbbtGraph.match(subject))

        assert.equal(subjects.length, 1)
        assert.equal(subjects[0].toString(), subject.toString())
      })

      it('should list subjects with filter', function () {
        var subject = rdf.createNamedNode('http://localhost:8080/data/person/amy-farrah-fowler')
        var subjects = rdf.utils.list.subjects(tbbtGraph, function (node) { return node.equals(subject) })

        assert.equal(subjects.length, 1)
        assert.equal(subjects[0].toString(), subject.toString())
      })

      it('should list predicates', function () {
        var predicate = rdf.createNamedNode('http://schema.org/knows')
        var predicates = rdf.utils.list.predicates(tbbtGraph.match(null, predicate))

        assert.equal(predicates.length, 1)
        assert.equal(predicates[0].toString(), predicate.toString())
      })

      it('should list predicates with filter', function () {
        var predicate = rdf.createNamedNode('http://schema.org/knows')
        var predicates = rdf.utils.list.predicates(tbbtGraph, function (node) { return node.equals(predicate) })

        assert.equal(predicates.length, 1)
        assert.equal(predicates[0].toString(), predicate.toString())
      })

      it('should list objects', function () {
        var object = rdf.createLiteral('microbiologist')
        var objects = rdf.utils.list.objects(tbbtGraph.match(null, null, object))

        assert.equal(objects.length, 1)
        assert.equal(objects[0].toString(), object.toString())
      })

      it('should list objects with filter', function () {
        var object = rdf.createLiteral('microbiologist')
        var objects = rdf.utils.list.objects(tbbtGraph, function (node) { return node.equals(object) })

        assert.equal(objects.length, 1)
        assert.equal(objects[0].toString(), object.toString())
      })
    })

    describe('subgraph', function () {
      it('should create a subgraph', function () {
        var tbbtGraphNg = rdf.createGraph()

        // create a copy of tbbt + a not linked triple
        tbbtGraphNg.addAll(tbbtGraph)
        tbbtGraphNg.add(rdf.createTriple(
          rdf.createNamedNode('http://example.org/subject'),
          rdf.createNamedNode('http://example.org/predicate'),
          rdf.createLiteral('object')))

        var subgraph = rdf.utils.createSubGraph(
          tbbtGraphNg,
          rdf.createNamedNode('http://localhost:8080/data/person/amy-farrah-fowler'))

        assert.equal(subgraph.length, tbbtGraph.length)
      })

      it('should create a subgraph with filter', function () {
        var subject = rdf.createNamedNode('http://localhost:8080/data/person/amy-farrah-fowler')

        var subgraph = rdf.utils.createSubGraph(tbbtGraph, subject, function (triple) {
          return triple.predicate.equals(rdf.createNamedNode('http://schema.org/knows'))
        })

        assert.equal(subgraph.length, 61)
        assert.equal(rdf.utils.list.predicates(subgraph).length, 1)
      })

      it('should create a subgraph by NamedNode subject', function () {
        var subgraph = rdf.utils.createSubGraphByNamedNodeSubject(
          tbbtGraph,
          rdf.createNamedNode('http://localhost:8080/data/person/amy-farrah-fowler'))

        assert.equal(subgraph.length, 12)
      })

      it('should split a graph by NamedNode subject into a store', function (done) {
        rdf.utils.splitGraphByNamedNodeSubject(tbbtGraph)
          .then(function (store) {
            assert.equal(Object.keys(store.graphs).length, 9)
          })
          .then(function () {
            done()
          })
          .catch(function (error) {
            done(error)
          })
      })
    })
  })
}
