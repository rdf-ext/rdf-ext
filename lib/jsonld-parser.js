/* global rdf:true */
'use strict';

var isNode = (typeof process !== 'undefined' && process.versions && process.versions.node);


if (isNode) {
  global.jsonld = require('jsonld');
}


var JsonLdParser = function (rdf, options) {
  if (options == null) {
    options = {};
  }

  var jsonldExpandFlat = function (data, base, callback) {
    jsonld.expand(data, {'base': base}, function (error, expanded) {
      if (error != null) {
        return callback(null);
      }

      jsonld.flatten(expanded, {}, function (error, flattened) {
        if (error != null) {
          return callback(null);
        }

        if (!('@graph' in flattened)) {
          return callback(null);
        }

        callback(flattened['@graph']);
      });
    });
  };

  var toArray = function (object) {
    if (object == null) {
      return [];
    }

    if (Array.isArray(object)) {
      return object;
    }

    return [object];
  };

  this.process = function (data, callback, base, filter, done) {
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    if (base == null) {
      base = '';
    }

    if (filter == null) {
      filter = function () { return true; };
    }

    if (done == null) {
      done = function () {};
    }

    var getLiteral = function (jNode) {
      var
        type = null,
        lang = null;

      if ('@type' in jNode) {
        type = getNode(jNode['@type']);
      }

      if ('@language' in jNode) {
        lang = jNode['@language'];
      }

      return rdf.createLiteral(jNode['@value'], lang, type);
    };

    var nodeCache = {};

    var getNode = function (jNode) {
      // is there already a node?
      if (jNode in nodeCache) {
        return nodeCache[jNode];
      }

      // is it a blank node?
      if (jNode == null || jNode.indexOf('_:') === 0) {
        return nodeCache[jNode] = rdf.createBlankNode();
      }

      // if not it's a named node
      return nodeCache[jNode] = rdf.createNamedNode(jNode);
    };

    var pushTriple = function (subject, predicate, object) {
      var triple = rdf.createTriple(subject, predicate, object);

      if (filter(triple)) {
        callback(triple);
      }
    };

    var processSubject = function (jSubject) {
      var
        subject = jSubject['@id'],
        types = toArray(jSubject['@type']);

      // add type triples
      types.forEach(function (type) {
        pushTriple(
          getNode(subject),
          getNode(rdf.ns.type),
          getNode(type));
      });

      // other triples
      for (var predicate in jSubject) {
        // ignore JSON-LD properties
        if (predicate.indexOf('@') === 0) {
          continue;
        }

        processPredicate(subject, predicate, toArray(jSubject[predicate]));
      }
    };

    var processPredicate = function (subject, predicate, jObjects) {
      jObjects.forEach(function (jObject) {
        pushTriple(
          getNode(subject),
          getNode(predicate),
          processObject(jObject));
      });
    };

    var processObject = function (jObject) {
      // is it a simple literal?
      if (typeof jObject === 'string') {
        return rdf.createLiteral(jObject);
      }

      // or blank node / named node
      if ('@id' in jObject) {
        return getNode(jObject['@id']);
      }

      // or complex literal
      return getLiteral(jObject);
    };

    jsonldExpandFlat(data, base, function (jGraph) {
      if (jGraph == null) {
        return done(false);
      }

      jGraph.forEach(function (jSubject) {
        processSubject(jSubject);
      });

      done(true);
    });

    return true;
  };

  this.parse = function (data, callback, base, filter, graph) {
    if (graph == null) {
      graph = rdf.createGraph();
    }

    return this.process(
      data,
      function (triple) { graph.add(triple); },
      base,
      filter,
      function (success) { callback(success ? graph : null); });
  };
};


if (isNode) {
  module.exports = function (rdf) {
    rdf.JsonLdParser = JsonLdParser.bind(null, rdf);

    var parser = new JsonLdParser(rdf);
    rdf.parseJsonLd = parser.parse.bind(parser);
  };

  module.exports.parser = JsonLdParser;
} else {
  if (typeof rdf === 'undefined') {
    rdf = {};
  }

  rdf.JsonLdParser = JsonLdParser.bind(null, rdf);

  var parser = new JsonLdParser(rdf);
  rdf.parseJsonLd = parser.parse.bind(parser);
}