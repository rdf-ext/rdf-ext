/* global rdf:true */
'use strict';


var NTriplesSerializer = function (rdf) {
  this.serialize = function (graph, callback) {
    callback = callback || function () {};

    var nTriples = rdf.Graph.toString(graph);

    callback(nTriples);

    return nTriples;
  };
};


module.exports = function (rdf) {
  rdf.NTriplesSerializer = NTriplesSerializer.bind(null, rdf);

  var serializer = new NTriplesSerializer(rdf);
  rdf.serializeNTriples = serializer.serialize.bind(serializer);
};
