/* global rdf:true */
'use strict';


var RdfstoreStore = function (store) {
  var
    self = this,
    rdf = store.rdf;

  self.graph = function (iri, callback) {
    store.graph(iri, function (success, graph) {
      if (success) {
        callback(graph);
      } else {
        callback(null);
      }
    });
  };

  self.match = function (iri, subject, predicate, object, callback, limit) {
    self.graph(iri, function (graph) {
      if (!graph) {
        callback(null);
      } else {
        callback(graph.match(subject, predicate, object, limit));
      }
    });
  };

  self.add = function (iri, graph, callback) {
    store.clear(iri, function () {
      store.insert(graph, iri, function (success) {
        if (success) {
          callback(graph);
        } else {
          callback(null, 'couldn\'n insert graph');
        }
      });
    });
  };

  self.merge = function (iri, graph, callback) {
    store.insert(graph, iri, function (success) {
      if (success) {
        callback(graph);
      } else {
        callback(null, 'couldn\'n insert graph');
      }
    });
  };

  self.remove = function (iri, graph, callback) {
    self.graph(iri, function (oldGraph) {
      var newGraph = rdf.Graph.difference(oldGraph, graph);

      self.add(iri, newGraph, function (addedGraph) {
        callback(!!addedGraph);
      });
    });
  };

  self.removeMatches = function (iri, subject, predicate, object, callback) {
    self.graph(iri, function (oldGraph) {
      var newGraph = oldGraph.removeMatches(subject, predicate, object);

      self.add(iri, newGraph, function (addedGraph) {
        callback(!!addedGraph);
      });
    });
  };

  self.delete = function (iri, callback) {
    store.clear(iri, function (success) {
      if (success) {
        callback(true);
      } else {
        callback(null, 'couldn\'n delete graph');
      }
    });
  };
};


module.exports = function (rdf) {
  rdf.RdfstoreStore = RdfstoreStore;
};
