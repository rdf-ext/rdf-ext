/* global rdf:true */
'use strict';


var SingleGraphStore = function (rdf, singleGraph) {
  this.graph = function (iri, callback) {
    callback(singleGraph);
  };

  this.match = function (iri, subject, predicate, object, callback, limit) {
    callback(singleGraph.match(subject, predicate, object, limit));
  };

  this.add = function (iri, graph, callback) {
    callback(singleGraph = graph);
  };

  this.merge = function (iri, graph, callback) {
    singleGraph.addAll(graph);

    callback(graph);
  };

  this.remove = function (iri, graph, callback) {
    singleGraph = rdf.difference(singleGraph, graph);

    callback(true);
  };

  this.removeMatches = function (iri, subject, predicate, object, callback) {
    singleGraph.removeMatches(subject, predicate, object);

    callback(true);
  };

  this.delete = function (iri, callback) {
    singleGraph.removeMatches();

    callback(true);
  };
};


module.exports = function (rdf) {
  rdf.SingleGraphStore = SingleGraphStore.bind(null, rdf);
};
