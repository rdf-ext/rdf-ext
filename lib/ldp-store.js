/* global rdf:true */
'use strict';

var isNode = (typeof process !== 'undefined' && process.versions && process.versions.node);


var LdpStore = function (rdf, options) {
  var self = this;

  if (options == null) {
    options = {};
  }

  self.parsers = {
    'application/ld+json': rdf.parseJsonLd,
    'text/turtle': rdf.parseTurtle
  };
  self.serializers = {
    'application/ld+json': rdf.serializeJsonLd,
    'application/n-triples': rdf.serializeNTriples,
    'text/turtle': rdf.serializeNTriples
  };
  self.defaultParser = 'text/turtle';
  self.defaultSerializer = 'application/n-triples'; //TODO: use options method to detect
  self.request = rdf.defaultRequest;

  if ('request' in options) {
    self.request = options.request;
  }

  var buildAccept = function() {
    var accept = null;

    for (var mimeType in self.parsers) {
      if (accept == null) {
        accept = mimeType;
      } else {
        accept += ', ' + mimeType;
      }
    }

    return accept;
  };

  var httpSuccess = function (statusCode) {
    return (statusCode >= 200 && statusCode < 300);
  };

  self.graph = function (iri, callback) {
    self.request('GET', iri, {'Accept': buildAccept()}, null,
      function (statusCode, headers, content, error) {
        // error during request
        if (error != null) {
          return callback(null, 'request error: ' + error);
        }

        // http status code != success
        if (!httpSuccess(statusCode)) {
          return callback(null, 'status code error: ' + statusCode);
        }

        // use default parser...
        var contentType = self.defaultParser;

        // ...if content-type is not given or unknown
        if ('content-type' in headers && headers['content-type'] in self.parsers) {
          contentType = headers['content-type'];
        }

        self.parsers[contentType](content, function (graph, error) {
          callback(graph, error != null ? 'parser error: ' + error : null);
        }, iri);
      }
    );
  };

  self.match = function (iri, subject, predicate, object, callback, limit) {
    self.graph(iri, function (graph, error) {
      if (error != null) {
        return callback(null, error);
      }

      callback(graph.match(subject, predicate, object, limit));
    });
  };

  self.add = function (iri, graph, callback) {
    //TODO: implement me
  };

  self.merge = function (iri, graph, callback) {
    //TODO: implement me
    var mimeType = 'text/turtle';

    self.serializers[mimeType](graph, function (data) {
      self.request('PATCH', iri, {'Content-Type': mimeType}, data,
        function (statusCode, headers, content, error) {
          callback(graph, error);
        }
      );
    });
  };

  self.remove = function (iri, graph, callback) {
    //TODO: implement me
  };

  self.removeMatches = function (iri, subject, predicate, object, callback) {
    //TODO: implement me
  };

  self.delete = function (iri, callback) {
    self.request('DELETE', iri, {}, null,
      function (statusCode, headers, content, error) {
        // error during request
        if (error != null) {
          return callback(false, 'request error: ' + error);
        }

        // http status code != success
        if (!httpSuccess(statusCode)) {
          return callback(false, 'status code error: ' + statusCode);
        }

        callback(true);
      }
    );
  };
};


if (isNode) {
  module.exports = function (rdf) {
    rdf.LdpStore = LdpStore.bind(null, rdf);
  };

  module.exports.store = LdpStore;
} else {
  if (typeof rdf === 'undefined') {
    rdf = {};
  }

  rdf.LdpStore = LdpStore.bind(null, rdf);
}