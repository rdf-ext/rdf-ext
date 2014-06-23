/* global rdf:true */
'use strict';

var isNode = (typeof process !== 'undefined' && process.versions && process.versions.node);


var RdfstoreStore = function (store, options) {
  if (options == null) {
    options = {};
  }

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
      if (graph == null) {
        callback(null);
      } else {
        callback(graph.match(subject, predicate, object, limit));
      }
    });
  };

  self.add = function (iri, graph, callback) {
    store.clear(iri, function () {
      store.insert(graph, iri, function (insertSuccess) {
        if (insertSuccess) {
          callback(graph);
        } else {
          callback(null);
        }
      });
    });
  };

  self.merge = function (iri, graph, callback) {
    store.insert(graph, iri, function (success) {
      if (success) {
        callback(graph);
      } else {
        callback(null);
      }
    });
  };

  self.remove = function (iri, graph, callback) {
    self.graph(iri, function (oldGraph) {
      var newGraph = rdf.Graph.difference(oldGraph, graph);

      self.add(iri, newGraph, function (addedGraph) {
        callback(addedGraph != null);
      });
    });
  };

  self.removeMatches = function (iri, subject, predicate, object, callback) {
    self.graph(iri, function (oldGraph) {
      var newGraph = oldGraph.removeMatches(subject, predicate, object);

      self.add(iri, newGraph, function (addedGraph) {
        callback(addedGraph != null);
      });
    });
  };

  self.delete = function (iri, callback) {
    store.clear(iri, function (success) {
      if (success) {
        callback(true);
      } else {
        callback(null);
      }
    });
  };
};


if (isNode) {
  module.exports = function (rdf) {
    rdf.RdfstoreStore = RdfstoreStore;
  };

  module.exports.store = RdfstoreStore;
} else {
  if (typeof rdf === 'undefined') {
    rdf = {};
  }

  rdf.RdfstoreStore = RdfstoreStore;
}