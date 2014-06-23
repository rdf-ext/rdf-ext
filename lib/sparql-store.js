/* global rdf:true */
'use strict';

var isNode = (typeof process !== 'undefined' && process.versions && process.versions.node);

//TODO: handle blank nodes
var SparqlStore = function (rdf, options) {
  if (options == null) {
    options = {};
  }

  var self = this;

  self.endpointUrl = options.endpointUrl;
  self.updateUrl = 'updateUrl' in options ? options.updateUrl : self.endpointUrl;
  self.mimeType = 'mimeType' in options ? options.mimeType : 'text/turtle';
  self.serialize = 'serialize' in options ? options.serialize : rdf.serializeNTriples;
  self.parse = 'parse' in options ? options.parse : rdf.parseTurtle;
  self.request = 'request' in options ? options.request : rdf.defaultRequest;

  var httpSuccess = function (statusCode) {
    return (statusCode >= 200 && statusCode < 300);
  };

  var buildMatch = function (subject, predicate, object) {
    var match = '';

    var nodeToNT = function (node) {
      if (typeof node == 'string') {
        if (node.substr(0, 2) == '_:') {
          return node;
        } else {
          return '<' + node + '>';
        }
      }

      return node.toNT();
    };

    match += subject != null ? nodeToNT(subject) : '?s';
    match += predicate != null ? ' ' + nodeToNT(predicate) : ' ?p';
    match += object != null ? ' ' + nodeToNT(object) : ' ?o';

    return match;
  };

  self.graph = function (graphIri, callback) {
    self.match(graphIri, null, null, null, callback);
  };

  self.match = function (graphIri, subject, predicate, object, callback, limit) {
    var
      filter = buildMatch(subject, predicate, object),
      query = 'CONSTRUCT { ' + filter + ' } { GRAPH <' + graphIri + '> {' + filter + ' }}',
      url = self.endpointUrl + '?query=' + encodeURIComponent(query);

    self.request('GET', url, { 'Accept': self.mimeType }, null,
      function (statusCode, headers, resContent, error) {
        // error during request
        if (error != null) {
          return callback(null, 'request error: ' + error);
        }

        // http status code != success
        if (!httpSuccess(statusCode)) {
          return callback(null, 'status code error: ' + statusCode);
        }

        // TODO: use limit parameters
        self.parse(resContent, callback);
      }
    );
  };

  var updateRequest = function (content, callbackValue, callback) {
    self.request('POST', self.updateUrl, { 'Content-Type': 'application/sparql-update' }, content,
      function (statusCode, headers, resContent, error) {
        // error during request
        if (error != null) {
          return callback(null, 'request error: ' + error);
        }

        // http status code != success
        if (!httpSuccess(statusCode)) {
          return callback(null, 'status code error: ' + statusCode);
        }

        callback(callbackValue);
      }
    );
  };

  self.add = function (graphIri, graph, callback) {
    var content =
      'DROP SILENT GRAPH <' + graphIri + '>;' +
      'INSERT DATA { GRAPH <' + graphIri + '> { ' + self.serialize(graph) + ' } }';

    updateRequest(content, graph, callback);
  };

  self.merge = function (graphIri, graph, callback) {
    var content =
      'INSERT DATA { GRAPH <' + graphIri + '> { ' + self.serialize(graph) + ' } }';

    updateRequest(content, graph, callback);
  };

  self.remove = function (graphIri, graph, callback) {
    var content =
      'DELETE DATA FROM <' + graphIri + '> { ' + self.serialize(graph) + ' }';

    updateRequest(content, true, callback);
  };

  self.removeMatches = function (graphIri, subject, predicate, object, callback) {
    var content =
      'DELETE FROM GRAPH <' + graphIri + '> WHERE { ' +
      buildMatch(subject, predicate, object) + ' }';

    updateRequest(content, true, callback);
  };

  self.delete = function (graphIri, callback) {
    var content = 'CLEAR  GRAPH <' + graphIri + '>';

    updateRequest(content, true, callback);
  };
};


if (isNode) {
  module.exports = function (rdf) {
    rdf.SparqlStore = SparqlStore.bind(null, rdf);
  };

  module.exports.store = SparqlStore;
} else {
  if (typeof rdf === 'undefined') {
    rdf = {};
  }

  rdf.SparqlStore = SparqlStore.bind(null, rdf);
}