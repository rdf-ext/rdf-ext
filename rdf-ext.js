/* global window */
'use strict';


var
  rdf = require('rdf-interfaces');


rdf.isNode = (typeof process !== 'undefined' && process.versions && process.versions.node);


var mixin = function (options) {
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

  require('./lib/clownface.js')(rdf);
  require('./lib/inmemory-store.js')(rdf);
  require('./lib/jsonld-parser.js')(rdf);
  require('./lib/jsonld-serializer.js')(rdf);
  require('./lib/ldp-store.js')(rdf);
  require('./lib/microdata-parser.js')(rdf);
  require('./lib/ntriples-serializer.js')(rdf);
  require('./lib/promise.js')(rdf);
  require('./lib/rdfstore-store.js')(rdf);
  require('./lib/rdfxml-parser.js')(rdf);
  require('./lib/singlegraph-store.js')(rdf);
  require('./lib/sparql-store.js')(rdf);
  require('./lib/turtle-parser.js')(rdf);
  require('./lib/turtle-serializer.js')(rdf);

  return rdf;
};


if (!rdf.isNode) {
  mixin();
}


module.exports = mixin;
