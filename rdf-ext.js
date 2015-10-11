/* global window */
'use strict';


var rdf = require('rdf-graph-array');
var InMemoryStore = require('rdf-store-inmemory');


rdf.isNode = (typeof process !== 'undefined' && process.versions && process.versions.node);


var mixin = function (rdf, options) {
  options = options || {};

  require('./lib/environment')(rdf)

  if (typeof window !== 'undefined') {
    window.rdf = rdf;
  }

  if (typeof Promise !== 'undefined') {
    rdf.Promise = Promise;
  } else {
    rdf.Promise = null;
  }

  rdf.defaultRequest = null;
  rdf.corsProxyRequest = null;
  rdf.ns = {
    type: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
  };

  require('./lib/utils')(rdf);

  if (rdf.isNode) {
    require('./lib/utils-node')(rdf);
  } else {
    require('./lib/utils-browser')(rdf);
  }

  rdf.createBlankNode = function () {
    return new rdf.BlankNode();
  };

  rdf.createNamedNode = function (iri) {
    return new rdf.NamedNode(iri);
  };

  rdf.createLiteral = function (value, language, datatype) {
    return new rdf.Literal(value, language, datatype);
  };

  rdf.createTriple = function (subject, predicate, object) {
    return new rdf.Triple(subject, predicate, object);
  };

  rdf.createQuad = function (subject, predicate, object, graph) {
    return new rdf.Quad(subject, predicate, object, graph);
  };

  rdf.createGraph = function (triples) {
    return new rdf.Graph(triples);
  };

  // Use InMemoryStore as default store
  rdf.createStore = function (options) {
    options = options || {}
    options.rdf = options.rdf || rdf

    return new InMemoryStore(options);
  };

  // Deprecated Store files
  function deprecatedError(name, pkg) {
    return function () {
      throw new Error(name + " is now deprecated, please see: http://npm.im/" + pkg)
    };
  }

  rdf.LdpStore = deprecatedError('LdpStore', 'rdf-store-ldp');
  rdf.RdfstoreStore = deprecatedError('RdfstoreStore', 'rdf-store-rdfstore-js');
  rdf.SingleGraphStore = deprecatedError('SingleGraphStore', 'rdf-store-singlegraph');
  rdf.SparqlStore = deprecatedError('SparqlStore', 'rdf-store-sparql');

  return rdf;
};

mixin(rdf)

module.exports = rdf;
