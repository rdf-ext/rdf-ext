/* global rdf:true */
'use strict';

var isNode = (typeof process !== 'undefined' && process.versions && process.versions.node);


var NTriplesSerializer = function (rdf) {
  this.serialize = function (graph, callback) {
    if (callback == null) {
      callback = function () {};
    }

    var nTriples = rdf.Graph.toString(graph);

    callback(nTriples);

    return nTriples;
  };
};


if (isNode) {
  module.exports = function (rdf) {
    rdf.NTriplesSerializer = NTriplesSerializer.bind(null, rdf);

    var serializer = new NTriplesSerializer(rdf);
    rdf.serializeNTriples = serializer.serialize.bind(serializer);
  };

  module.exports.serializer = NTriplesSerializer;
} else {
  if (typeof rdf === 'undefined') {
    rdf = {};
  }

  rdf.NTriplesSerializer = NTriplesSerializer.bind(null, rdf);

  var serializer = new NTriplesSerializer(rdf);
  rdf.serializeNTriples = serializer.serialize.bind(serializer);
}