'use strict';


var
  N3 = require('n3');


var TurtleSerializer = function (rdf, options) {
  options = options || {};

  options.usePrefixMap = options.usePrefixMap || true;

  this.serialize = function (graph, callback) {
    var
      writerOptions = {},
      writer;

    callback = callback || function () {};

    if (options.usePrefixMap) {
      writerOptions.prefixes = {};

      Object.keys(rdf.prefixes).forEach(function (prefix) {
        if (typeof rdf.prefixes[prefix] !== 'string') {
          return;
        }

        writerOptions.prefixes[prefix] = rdf.prefixes[prefix];
      });
    }

    writer = N3.Writer(writerOptions);

    var createN3Node = function (node) {
      if (node.interfaceName.toString() === 'NamedNode') {
        return node.nominalValue;
      } else if (node.interfaceName.toString() === 'BlankNode') {
        return '_:' + node.nominalValue;
      } else {
        if (node.datatype) {
          return '"' + node.nominalValue + '"^^' + node.datatype.nominalValue;
        } else if (node.language) {
          return '"' + node.nominalValue + '"@' + node.language;
        } else {
          return '"' + node.nominalValue + '"';
        }
      }
    };

    graph.forEach(function (triple) {
      writer.addTriple(
        createN3Node(triple.subject),
        createN3Node(triple.predicate),
        createN3Node(triple.object));
    });

    writer.end(function (error, result) {
      if (error) {
        callback(null, error);
      } else {
        callback(result);
      }
    });

    return true;
  };
};


module.exports = function (rdf) {
  rdf.TurtleSerializer = TurtleSerializer.bind(null, rdf);

  var serializer = new TurtleSerializer(rdf);
  rdf.serializeTurtle = serializer.serialize.bind(serializer);
};
