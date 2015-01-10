/* global rdf:true */
'use strict';

var isNode = (typeof process !== 'undefined' && process.versions && process.versions.node);


if (isNode) {
	global.jsonld = require('jsonld');
}


var JsonLdSerializer = function (rdf, options) {
  if (options == null) {
    options = {};
  }

  var rdfStringNode = rdf.createNamedNode('http://www.w3.org/2001/XMLSchema#string');

  this.serialize = function (graph, callback) {
    if (callback == null) {
      callback = function () {};
    }

    var jsonGraph = [];
    var subjects = {};

    var subjectIndex = function (s) {
      var sValue = s.valueOf();

      if (typeof subjects[sValue] === 'undefined') {
        if (s.interfaceName == 'BlankNode') {
          jsonGraph.push({ '@id': '_:' + sValue });
        } else {
          jsonGraph.push({ '@id': sValue });
        }

        subjects[sValue] = jsonGraph.length - 1;
      }

      return subjects[sValue];
    };

    var objectValue = function (o) {
      if (o.interfaceName == 'NamedNode') {
        return { '@id': o.valueOf() };
      } else if (o.interfaceName == 'BlankNode') {
        return { '@id': '_:' + o.valueOf()};
      } else {
        if (o.language != null) {
          return { '@language': o.language, '@value': o.valueOf() };
        } else if ('datatype' in o && o.datatype != null && !rdfStringNode.equals(o.datatype)) {
          return { '@type': o.datatype.valueOf(), '@value': o.valueOf() };
        } else {
          return o.valueOf();
        }
      }
    };

    graph.forEach(function (t) {
      var s = subjectIndex(t.subject);
      var p = t.property.valueOf();

      if (p == 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type') {
        if (typeof jsonGraph[s]['@type'] === 'undefined') {
          jsonGraph[s]['@type'] = [];
        }

        jsonGraph[s]['@type'].push(t.object.valueOf());
      } else {
        if (typeof jsonGraph[s][p] === 'undefined') {
          jsonGraph[s][p] = objectValue(t.object);
        } else {
          if (!Array.isArray(jsonGraph[s][p])) {
            jsonGraph[s][p] = [jsonGraph[s][p]];
          }

          jsonGraph[s][p].push(objectValue(t.object));
        }
      }
    });

    callback(jsonGraph);

    return jsonGraph;
  };
};


if (isNode) {
  module.exports = function (rdf) {
    rdf.JsonLdSerializer = JsonLdSerializer.bind(null, rdf);

    var serializer = new JsonLdSerializer(rdf);
    rdf.serializeJsonLd = (serializer).serialize.bind(serializer);
  };

  module.exports.serializer = JsonLdSerializer;
} else {
  if (typeof rdf === 'undefined') {
    rdf = {};
  }

  rdf.JsonLdSerializer = JsonLdSerializer.bind(null, rdf);

  var serializer = new JsonLdSerializer(rdf);
  rdf.serializeJsonLd = (serializer).serialize.bind(serializer);
}
