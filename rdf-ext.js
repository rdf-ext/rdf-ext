/* global window */
'use strict';


var
  rdf = require('rdf-interfaces'),
  InMemoryStore = require('rdf-store-inmemory');


rdf.isNode = (typeof process !== 'undefined' && process.versions && process.versions.node);


var mixin = function (rdf, options) {
  options = options || {};

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

  if (typeof rdf.Graph === 'undefined') {
    rdf.Graph = {};
  }

  rdf.Graph.difference = function (a, b) {
    var d = rdf.createGraph();

    a.forEach(function (at) {
      if (!b.some(function (bt) { return at.equals(bt); })) {
        d.add(at);
      }
    });

    return d;
  };

  rdf.Graph.intersection = function (a, b) {
    var i = rdf.createGraph();

    a.forEach(function (at) {
      if (b.some(function (bt) { return at.equals(bt); })) {
        i.add(at);
      }
    });

    return i;
  };

  rdf.Graph.map = function (graph, callback) {
    var result = [];

    graph.forEach(function (triple) {
      result.push(callback(triple));
    });

    return result;
  };

  rdf.Graph.merge = function (a, b) {
    var m = rdf.createGraph();

    m.addAll(a);
    m.addAll(b);

    return m;
  };

  rdf.Graph.toString = function (a) {
    var s = '';

    a.forEach(function (t) {
      s += t.toString() + '\n';
    });

    return s;
  };

  var wrappedCreateGraph = rdf.createGraph.bind(rdf);

  rdf.createGraphExt = function (triples) {
    var graph = wrappedCreateGraph(triples);

    graph.difference = rdf.Graph.difference.bind(graph, graph);

    graph.intersection = rdf.Graph.intersection.bind(graph, graph);

    graph.map = rdf.Graph.map.bind(graph, graph);

    graph.toString = rdf.Graph.toString.bind(graph, graph);

    if ('replaceMerge' in options && options.replaceMerge) {
      graph.merge = rdf.Graph.merge.bind(graph, graph);
    }

    return graph;
  };

  Object.defineProperty(rdf, 'createGraph', { value: rdf.createGraphExt });

  // Use InMemoryStore as default store
  rdf.createStore = function (options) {
    return new InMemoryStore(rdf, options);
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

mixin(rdf);

module.exports = rdf;
