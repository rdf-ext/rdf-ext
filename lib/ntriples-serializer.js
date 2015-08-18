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


var SparqlUpdateSerializer = function (rdf) {
  this.serialize = function (graph, callback) {
    rdf.serializeNTriples(graph, function (nTriples, error) {
      if (error) {
        return callback(null, error);
      }

      callback('INSERT DATA { ' + nTriples + ' }');
    });
  };
};


module.exports = function (rdf) {
  // N-Triples
  rdf.NTriplesSerializer = NTriplesSerializer.bind(null, rdf);

  var nTriplesSerializer = new NTriplesSerializer(rdf);
  rdf.serializeNTriples = nTriplesSerializer.serialize.bind(nTriplesSerializer);

  rdf.utils.mimeTypeSerializerMap['application/n-triples'] = rdf.serializeNTriples;

  // SPARQL Update
  rdf.SparqlUpdateSerializer = SparqlUpdateSerializer.bind(null, rdf);

  var sparqlUpdateSerializer = new SparqlUpdateSerializer(rdf);
  rdf.serializeSparqlUpdate = sparqlUpdateSerializer.serialize.bind(sparqlUpdateSerializer);

  rdf.utils.mimeTypeSerializerMap['application/sparql-update'] = rdf.serializeSparqlUpdate;
};
