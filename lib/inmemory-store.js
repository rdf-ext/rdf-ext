/* global rdf:true */
'use strict';

var isNode = (typeof process !== 'undefined' && process.versions && process.versions.node);


var InMemoryStore = function (rdf) {
  var graphs = {};

  this.graph = function (iri, callback) {
    var graph = null;

    if (iri === undefined) {
      graph = rdf.createGraph();

      this.forEach(function (toAdd) {
        graph.addAll(toAdd);
      });
    } else if (iri in graphs) {
      graph = graphs[iri];
    }

    callback(graph);
  };

  this.match = function (iri, subject, predicate, object, callback, limit) {
    this.graph(iri, function (graph) {
      if (graph == null) {
        callback(null);
      } else {
        callback(graph.match(subject, predicate, object, limit));
      }
    });
  };

  this.add = function (iri, graph, callback) {
    graphs[iri] = rdf.createGraph();
    graphs[iri].addAll(graph);

    callback(graph);
  };

  this.merge = function (iri, graph, callback) {
    if (iri in graphs) {
      graphs[iri].addAll(graph);
    } else {
      graphs[iri] = graph;
    }

    callback(graph);
  };

  this.remove = function (iri, graph, callback) {
    if (iri in graphs) {
      graphs[iri] = rdf.Graph.difference(graphs[iri], graph);
    }

    callback(true);
  };

  this.removeMatches = function (iri, subject, predicate, object, callback) {
    if (iri in graphs) {
      graphs[iri].removeMatches(subject, predicate, object);
    }

    callback(true);
  };

  this.delete = function (iri, callback) {
    if (iri in graphs) {
      delete graphs[iri];
    }

    callback(true);
  };

  this.forEach = function (callback) {
    Object.keys(graphs).forEach(function (iri) {
      callback(graphs[iri], iri);
    });
  };
};


if (isNode) {
  module.exports = function (rdf) {
    rdf.InMemoryStore = InMemoryStore.bind(null, rdf);
  };

  module.exports.store = InMemoryStore;
} else {
  if (typeof rdf === 'undefined') {
    rdf = {};
  }

  rdf.InMemoryStore = InMemoryStore.bind(null, rdf);
}