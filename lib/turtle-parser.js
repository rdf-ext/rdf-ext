'use strict';


var
  N3 = require('n3');


var TurtleParser = function (rdf, options) {
  options = options || {};

  if (!('importPrefixMap' in options)) {
    options.importPrefixMap = true;
  }

  this.process = function (data, callback, base, filter, done) {
    var config = {};

    config.documentIRI = base;
    filter = filter || function () { return true; };
    done = done || function () {};

    var
      parser = N3.Parser(config),
      blankNodes = {};

    parser.parse(data, function (error, n3Triple, n3Prefixes) {
      if (error) {
        return done(false, error);
      }

      if (options.importPrefixMap && n3Prefixes) {
        Object.keys(n3Prefixes).forEach(function (prefix) {
          rdf.prefixes[prefix] = n3Prefixes[prefix];
        });
      }

      if (!n3Triple) {
        return done(true);
      }

      var toRdfNode = function (n3Node) {
        if (N3.Util.isIRI(n3Node)) {
          return rdf.createNamedNode(n3Node);
        } else if (N3.Util.isBlank(n3Node)) {
          if (n3Node in blankNodes) {
            return blankNodes[n3Node];
          } else {
            return (blankNodes[n3Node] = rdf.createBlankNode());
          }
        } else {
          var
            lang = N3.Util.getLiteralLanguage(n3Node),
            type = N3.Util.getLiteralType(n3Node);

          if (lang === '') {
            lang = null;
          }

          if (type === 'http://www.w3.org/2001/XMLSchema#string') {
            type = null;
          }

          return rdf.createLiteral(
            N3.Util.getLiteralValue(n3Node),
            lang,
            type ? rdf.createNamedNode(type) : null);
        }
      };

      var pushTriple = function (n3Triple) {
        var triple = rdf.createTriple(
          toRdfNode(n3Triple.subject),
          toRdfNode(n3Triple.predicate),
          toRdfNode(n3Triple.object));

        if (filter(triple)) {
          callback(triple);
        }
      };

      pushTriple(n3Triple);
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


module.exports = function (rdf) {
  rdf.TurtleParser = TurtleParser.bind(null, rdf);
  rdf.NTriplesParser = TurtleParser.bind(null, rdf);

  var parser = new TurtleParser(rdf);
  rdf.parseTurtle = parser.parse.bind(parser);
  rdf.parseNTriples = parser.parse.bind(parser);

  rdf.utils.mimeTypeParserMap['application/n-triples'] = rdf.parseNTriples;
  rdf.utils.mimeTypeParserMap['text/n3'] = rdf.parseTurtle;
  rdf.utils.mimeTypeParserMap['text/turtle'] = rdf.parseTurtle;
};
