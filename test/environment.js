/* global describe, it */
var assert = require('assert')
var rdf = require('../rdf-ext')

module.exports = function () {
  describe('environment', function () {
    describe('PrefixMap', function () {
      it('should implement the interface defined in the spec', function () {
        var prefixMap = new rdf.PrefixMap()

        assert.equal(typeof prefixMap, 'object')
        assert.equal(typeof prefixMap.addAll, 'function')
        assert.equal(typeof prefixMap.resolve, 'function')
        assert.equal(typeof prefixMap.setDefault, 'function')
        assert.equal(typeof prefixMap.shrink, 'function')
      })

      it('the constructor should add all given prefixes', function () {
        var prefixMap = new rdf.PrefixMap({
          ex1: 'http://example.org/1/',
          ex2: 'http://example.org/2/'
        })

        assert.equal(prefixMap.ex1, 'http://example.org/1/')
        assert.equal(prefixMap.ex2, 'http://example.org/2/')
      })

      it('property operator should add a prefix', function () {
        var prefixMap = new rdf.PrefixMap()

        prefixMap.ex = 'http://example.org/'

        assert.equal(prefixMap.ex, 'http://example.org/')
      })

      it('array operator should add a prefix', function () {
        var prefixMap = new rdf.PrefixMap()

        prefixMap['ex'] = 'http://example.org/'

        assert.equal(prefixMap.ex, 'http://example.org/')
      })

      it('.addAll should add multiple prefixes', function () {
        var prefixMap = new rdf.PrefixMap()

        prefixMap.addAll({
          ex1: 'http://example.org/1/',
          ex2: 'http://example.org/2/'
        })

        assert.equal(prefixMap.ex1, 'http://example.org/1/')
        assert.equal(prefixMap.ex2, 'http://example.org/2/')
      })

      it('.resolve should expand a string', function () {
        var prefixMap = new rdf.PrefixMap({ex: 'http://example.org/'})

        var expanded = prefixMap.resolve('ex:test')

        assert.equal(expanded, 'http://example.org/test')
      })

      it('.setDefault should set the default namespace', function () {
        var prefixMap = new rdf.PrefixMap()

        prefixMap.setDefault('http://example.org/')

        var expanded = prefixMap.resolve(':test')

        assert.equal(prefixMap[''], 'http://example.org/')
        assert.equal(expanded, 'http://example.org/test')
      })

      it('.shrink should compact a string', function () {
        var prefixMap = new rdf.PrefixMap({ex: 'http://example.org/1/'})

        prefixMap.setDefault('http://example.org/2/')

        var shrinked = prefixMap.shrink('http://example.org/1/test')
        var shrinkedDefault = prefixMap.shrink('http://example.org/2/test')

        assert.equal(shrinked, 'ex:test')
        assert.equal(shrinkedDefault, ':test')
      })
    })

    describe('Profile', function () {
      it('should implement the interface defined in the spec', function () {
        var profile = new rdf.Profile()

        assert.equal(typeof profile, 'object')
        assert.equal(typeof profile.prefixes, 'object')
        // assert.equal(typeof profile.terms, 'object')
        assert.equal(typeof profile.resolve, 'function')
        // assert.equal(typeof profile.setDefaultVocabulary, 'function')
        assert.equal(typeof profile.setDefaultPrefix, 'function')
        // assert.equal(typeof profile.setTerm, 'function')
        assert.equal(typeof profile.setPrefix, 'function')
        assert.equal(typeof profile.importProfile, 'function')
      })
    })

    describe('RDFEnvironment', function () {
      it('should implement the interface defined in the spec', function () {
        var env = new rdf.RDFEnvironment()

        assert.equal(typeof env, 'object')
        assert.equal(typeof env.createBlankNode, 'function')
        assert.equal(typeof env.createNamedNode, 'function')
        assert.equal(typeof env.createLiteral, 'function')
        assert.equal(typeof env.createTriple, 'function')
        assert.equal(typeof env.createGraph, 'function')
        assert.equal(typeof env.createAction, 'function')
        assert.equal(typeof env.createProfile, 'function')
        // assert.equal(typeof env.createTermMap, 'function')
        assert.equal(typeof env.createPrefixMap, 'function')
      })

      it('should create a named node with correct IRI', function () {
        var iri = 'http://example.org#node'
        var node = rdf.createNamedNode(iri)

        assert.equal(node.nominalValue, iri)
      })

      it('should resolve a CURIE when creating a named node -- uses global RDFEnvironment', function () {
        rdf.setPrefix('ex', 'http://example.org/')
        var curie = 'ex:test'
        var iri = rdf.prefixes.resolve(curie)
        var node = rdf.createNamedNode(curie)

        assert.equal(node.nominalValue, iri)
      })

      it('should resolve a CURIE when creating a named node -- uses a separate RDFEnvironment', function () {
        var env = new rdf.RDFEnvironment()
        env.setPrefix('ex', 'http://example.org/')
        var curie = 'ex:test'
        var iri = env.prefixes.resolve(curie)
        var node = env.createNamedNode(curie)

        assert.equal(node.nominalValue, iri)
      })

      it('should not resolve a CURIE for unknown prefix', function () {
        var env = new rdf.RDFEnvironment()
        var curie = 'ex:test'
        var node = env.createNamedNode(curie)

        assert.throws(function () { env.prefixes.resolve(curie) }, Error)
        assert.equal(node.nominalValue, curie)
      })

      it('should not resolve a CURIE for unknown prefix', function () {
        var curie = 'fu:bar'
        var node = rdf.createNamedNode(curie)

        assert.throws(function () { rdf.prefixes.resolve(curie) }, Error)
        assert.equal(node.nominalValue, curie)
      })
    })
  })
}
