'use strict';


var
  jsonld = require('jsonld'),
  RDFa = require('jsonld/js/rdfa');


var JsonLdParser = function (rdf, options) {
  options = options || {};

  if (!('importPrefixMap' in options)) {
    options.importPrefixMap = true;
  }

  var jsonldExpandFlat = function (data, base, callback) {
    jsonld.expand(data, {'base': base}, function (error, expanded) {
      if (error) {
        return callback(null, error.message);
      }

      jsonld.flatten(expanded, {}, function (error, flattened) {
        if (error) {
          return callback(null, error.message);
        }

        if (!('@graph' in flattened)) {
          return callback(null);
        }

        callback(flattened['@graph']);
      });
    });
  };

  var toArray = function (object) {
    object = object || [];

    if (Array.isArray(object)) {
      return object;
    }

    return [object];
  };

  this.process = function (data, callback, base, filter, done) {
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    base = base || '';
    filter = filter || function () { return true; };
    done = done || function () {};

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
      if (!jNode) {
        return rdf.createBlankNode();
      }

      if (jNode.indexOf('_:') === 0) {
        return (nodeCache[jNode] = rdf.createBlankNode());
      }

      // if not it's a named node
      return (nodeCache[jNode] = rdf.createNamedNode(jNode));
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

      if ('@list' in jObject) {
        return processList(jObject['@list']);
      }

      // or complex literal
      return getLiteral(jObject);
    };

    var processList = function (jList) {
      var
        entry = getNode(),
        subject = entry,
        rest;

      jList.forEach(function (jItem, index) {
        if (index !== jList.length-1) {
          rest = getNode();
        } else {
          rest = getNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#nil');
        }

        pushTriple(
          subject,
          getNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#first'),
          getNode(jItem['@id']));

        pushTriple(
          subject,
          getNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#rest'),
          rest);

        subject = rest;
      });

      return entry;
    };

    if (options.importPrefixMap && '@context' in data && typeof data['@context'] === 'object') {
      var context = data['@context'];

      Object.keys(context).forEach(function (key) {
        if (key.slice(1) !== '@' && typeof context[key] === 'string') {
          rdf.prefixes[key] = context[key];
        }
      });
    }

    jsonldExpandFlat(data, base, function (jGraph, error) {
      if (error) {
        return done(false, error);
      }

      if (!jGraph) {
        return done(true);
      }

      jGraph.forEach(function (jSubject) {
        processSubject(jSubject);
      });

      done(true);
    });

    return true;
  };

  this.parse = function (data, callback, base, filter, graph) {
    graph = graph || rdf.createGraph();

    return this.process(
      data,
      function (triple) { graph.add(triple); },
      base,
      filter,
      function (success, error) { callback(success ? graph : null, error); });
  };
};


var RdfaParser = function (rdf) {
  var jsonLdParser = new JsonLdParser(rdf);

  this.parse = function (rdfaData, callback, base, filter, graph) {
    if (typeof rdfaData === 'string') {
      try {
        rdfaData = rdf.parseHtml(rdfaData);
      } catch (error) {
        callback(null, error);

        return false;
      }
    }

    graph = graph || rdf.createGraph();

    rdfaData.location = { href: base };
    RDFa.attach(rdfaData);

    jsonld.fromRDF(rdfaData.data, {format: 'rdfa-api'}, function (error, jsonLdData) {
      if (error) {
        callback(null, error);
      } else {
        jsonLdParser.process(
          jsonLdData,
          function (triple) {
            graph.add(triple);
          },
          base,
          filter,
          function (success, error) {
            callback(success ? graph : null, error);
          });
      }
    });

    return true;
  };
};


module.exports = function (rdf) {
  rdf.JsonLdParser = JsonLdParser.bind(null, rdf);

  var jsonLdParser = new JsonLdParser(rdf);
  rdf.parseJsonLd = jsonLdParser.parse.bind(jsonLdParser);

  rdf.utils.mimeTypeParserMap['application/ld+json'] = rdf.parseJsonLd;

  rdf.RdfaParser = RdfaParser.bind(null, rdf);

  var rdfaParser = new RdfaParser(rdf);
  rdf.parseRdfa = rdfaParser.parse.bind(rdfaParser);
};
