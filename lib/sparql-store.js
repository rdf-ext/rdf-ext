'use strict';


//TODO: handle blank nodes
var SparqlStore = function (rdf, options) {
  var
    self = this;

  options = options || {};

  self.endpointUrl = options.endpointUrl;
  self.updateUrl = options.updateUrl || self.endpointUrl;
  self.mimeType = options.mimeType || 'text/turtle';
  self.serialize = options.serialize  || rdf.serializeNTriples;
  self.parse = options.parse || rdf.parseTurtle;
  self.request = options.request || rdf.defaultRequest;

  var httpSuccess = function (statusCode) {
    return (statusCode >= 200 && statusCode < 300);
  };

  var buildMatch = function (subject, predicate, object) {
    var match = '';

    var nodeToNT = function (node) {
      if (typeof node === 'string') {
        if (node.substr(0, 2) === '_:') {
          return node;
        } else {
          return '<' + node + '>';
        }
      }

      return node.toNT();
    };

    match += subject ? nodeToNT(subject) : '?s';
    match += predicate ? ' ' + nodeToNT(predicate) : ' ?p';
    match += object ? ' ' + nodeToNT(object) : ' ?o';

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
        if (error) {
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
        if (error) {
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


module.exports = function (rdf) {
  rdf.SparqlStore = SparqlStore.bind(null, rdf);
};
