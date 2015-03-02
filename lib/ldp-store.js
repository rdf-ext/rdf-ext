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
    'application/n-triples': rdf.parseTurtle,
    'text/turtle': rdf.parseTurtle
  };
  self.serializers = {
    'application/ld+json': rdf.serializeJsonLd,
    'application/n-triples': rdf.serializeNTriples,
    'application/sparql-update': LdpStore.serializeSparqlUpdate,
    'text/turtle': rdf.serializeNTriples
  };
  self.defaultParser = 'text/turtle';
  self.defaultSerializer = 'text/turtle';
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

  self.graph = function (iri, callback, options) {
    if (options == null) {
      options = {};
    }

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
          if (error != null) {
            return callback(null, 'parser error: ' + error);
          }

          // copy etag header to Graph object
          if ('useEtag' in options && options.useEtag && 'etag' in headers) {
            graph.etag = headers.etag;
          }

          callback(graph);
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

  self.add = function (iri, graph, callback, options) {
    var
      method = 'PUT',
      contentType = self.defaultSerializer,
      headers = {};

    if (options == null) {
      options = {};
    }

    headers['Content-Type'] = contentType;

    if ('method' in options) {
      method = options.method;
    }

    if ('etag' in options) {
      headers['If-Match'] = options.etag;
    }

    if ('useEtag' in options && options.useEtag && 'etag' in graph) {
      headers['If-Match'] = graph.etag;
    }

    self.serializers[contentType](graph, function (data) {
      self.request(method, iri, headers, data,
        function (statusCode, headers, content, error) {
          callback(graph, error);
        }
      );
    });
  };

  self.merge = function (iri, graph, callback, options) {
    var
      contentType = 'application/sparql-update';
      headers = {};

    headers['Content-Type'] = contentType;

    if (options == null) {
      options = {};
    }

    if ('etag' in options) {
      headers['If-Match'] = options.etag;
    }

    if ('useEtag' in options && options.useEtag && 'etag' in graph) {
      headers['If-Match'] = graph.etag;
    }

    self.serializers[contentType](graph, function (data) {
      self.request('PATCH', iri, headers, data,
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


LdpStore.serializeSparqlUpdate = function (rdf, graph, callback) {
  rdf.serializeNTriples(graph, function (nTriples, error) {
    if (error != null) {
      return callback(null, error);
    }

    callback('INSERT DATA { ' + nTriples + ' }');
  });
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
