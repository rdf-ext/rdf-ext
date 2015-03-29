'use strict';


var utils = {};


/*
 * generic filters
 */
utils.filter = {};

utils.filter.namedNode = function (node) {
  return node.interfaceName === 'NamedNode';
};

utils.filter.blankNode = function (node) {
  return node.interfaceName === 'BlankNode';
};

utils.filter.literal = function (node) {
  return node.interfaceName === 'Literal';
};

utils.filter.namedNodeSubject = function (subject) {
  return function (triple) {
    return triple.subject.interfaceName !== 'NamedNode' || triple.subject.equals(subject);
  };
};


/*
 * list triple parts
 */
utils.list = {};

utils.list.tripleParts = function (graph, part, filter) {
  var nodes = {};

  filter = filter || function () { return true; };

  graph.forEach(function (triple) {
    nodes[triple[part].toNT()] = triple[part];
  });

  nodes = Object.keys(nodes)
    .map(function (key) {
      return nodes[key];
    })
    .filter(function (node) {
      return filter(node);
    });

  return nodes;
};

utils.list.subjects = function (graph, filter) {
  return utils.list.tripleParts(graph, 'subject', filter);
};

utils.list.predicates = function (graph, filter) {
  return utils.list.tripleParts(graph, 'predicate', filter);
};

utils.list.objects = function (graph, filter) {
  return utils.list.tripleParts(graph, 'object', filter);
};


/*
 * Creates a subgraph by traversing a graph with filter support
 */
utils.createSubGraph = function (rdf, graph, entry, filter) {
  var
    processedEntries = {},
    subGraph = rdf.createGraph();

  var processSubject = function (entries) {
    if (entries.length === 0) {
      return;
    }

    var
      newEntries = [],
      matches = rdf.createGraph();

    entries.forEach(function (entry) {
      matches.addAll(graph.match(entry));
    });

    if (filter != null) {
      matches = matches.filter(filter);
    }

    matches.forEach(function (match) {
      var key = match.object.toNT();

      if (!(key in processedEntries)) {
        newEntries.push(match.object);
        processedEntries[key] = true;
      }
    });

    subGraph.addAll(matches);

    processSubject(newEntries);
  };

  processSubject([entry]);

  return subGraph;
};


/*
 * Create a subgraph based on a named node subject without crossing named node borders
 */
utils.createSubGraphByNamedNodeSubject = function (rdf, graph, subject) {
  return rdf.utils.createSubGraph(graph, subject, utils.filter.namedNodeSubject(subject))
};

/*
 * Fills a store based on createSubGraphByNamedNodeSubject for all named node subjects
 */
utils.splitGraphByNamedNodeSubject = function (rdf, graph, store) {
  store = store || new rdf.promise.Store(rdf.createStore());

  var adds = [];

  utils.list.subjects(graph, utils.filter.namedNode).forEach(function (subject) {
    adds.push(store.add(subject, utils.createSubGraphByNamedNodeSubject(rdf, graph, subject)));
  });

  return Promise.all(adds).then(function () {
    return store;
  });
};


utils.mixin = function (rdf) {
  rdf.utils = {};
  rdf.utils.filter = utils.filter;
  rdf.utils.list = utils.list;
  rdf.utils.createSubGraph = utils.createSubGraph.bind(null, rdf);
  rdf.utils.createSubGraphByNamedNodeSubject = utils.createSubGraphByNamedNodeSubject.bind(null, rdf);
  rdf.utils.splitGraphByNamedNodeSubject = utils.splitGraphByNamedNodeSubject.bind(null, rdf);
};


module.exports = utils.mixin;
