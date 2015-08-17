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

    if (filter) {
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
  return rdf.utils.createSubGraph(graph, subject, utils.filter.namedNodeSubject(subject));
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


/*
 * namespace mapping
 */
utils.mapNamespaceNode = function (rdf, node, search, replace) {
  // process only named nodes...
  if (node.interfaceName !== 'NamedNode') {
    return node;
  }

  // ...that start with search
  if (node.nominalValue.toString().indexOf(search) !== 0) {
    return node;
  }

  // create new named node with replace + original node without search
  return rdf.createNamedNode(replace + node.nominalValue.toString().substr(search.length));
};

utils.mapNamespaceTriple = function (rdf, triple, search, replace) {
  return rdf.createTriple(
    utils.mapNamespaceNode(rdf, triple.subject, search, replace),
    utils.mapNamespaceNode(rdf, triple.predicate, search, replace),
    utils.mapNamespaceNode(rdf, triple.object, search, replace)
  );
};

utils.mapNamespaceGraph = function (rdf, graph, search, replace) {
  var mappedGraph = rdf.createGraph();

  graph.forEach(function (triple) {
    mappedGraph.add(utils.mapNamespaceTriple(rdf, triple, search, replace));
  });

  return mappedGraph;
};


/*
 * mime type handling
 */
utils.mimeTypeParserMap = {};

utils.parse = function (mimeType, data, base, filter, graph) {
  if (!(mimeType in utils.mimeTypeParserMap)) {
    return Promise.reject('no parser available for mime type: ' + mimeType);
  } else {
    return rdf.promise.parse(utils.mimeTypeParserMap[mimeType])(data, base, filter, graph);
  }
};


utils.mixin = function (rdf) {
  rdf.utils = {};
  rdf.utils.filter = utils.filter;
  rdf.utils.list = utils.list;
  rdf.utils.createSubGraph = utils.createSubGraph.bind(null, rdf);
  rdf.utils.createSubGraphByNamedNodeSubject = utils.createSubGraphByNamedNodeSubject.bind(null, rdf);
  rdf.utils.splitGraphByNamedNodeSubject = utils.splitGraphByNamedNodeSubject.bind(null, rdf);
  rdf.utils.mapNamespaceNode = utils.mapNamespaceNode.bind(null, rdf);
  rdf.utils.mapNamespaceTriple = utils.mapNamespaceTriple.bind(null, rdf);
  rdf.utils.mapNamespaceGraph = utils.mapNamespaceGraph.bind(null, rdf);
  rdf.utils.mimeTypeParserMap = utils.mimeTypeParserMap;
  rdf.utils.parse = utils.parse;
};


module.exports = utils.mixin;
