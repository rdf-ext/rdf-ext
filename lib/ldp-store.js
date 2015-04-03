'use strict';


var LdpStore = function (rdf, options) {
  var self = this;

  options = options || {};

  self.parsers = options.parsers || LdpStore.defaultParsers(rdf);
  self.serializers = options.serializers || LdpStore.defaultSerializers(rdf);
  self.defaultParser = options.defaultParser || 'text/turtle';
  self.defaultSerializer = options.defaultSerializer || 'text/turtle';
  self.defaultPatchSerializer = options.defaultPatchSerializer || options.defaultSerializer || 'text/turtle';
  self.request = options.request || rdf.defaultRequest;

  var buildAccept = function() {
    var accept = null;

    for (var mimeType in self.parsers) {
      if (!accept) {
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
    options = options || {};

    self.request('GET', iri, {'Accept': buildAccept()}, null,
      function (statusCode, headers, content, error) {
        // error during request
        if (error) {
          return callback(null, 'request error: ' + error);
        }

        // http status code != success
        if (!httpSuccess(statusCode)) {
          // in case of GET allow statusCode of 0 for browser local load
          if (statusCode !== 0) {
            return callback(null, 'status code error: ' + statusCode);
          }
        }

        // use default parser...
        var contentType = self.defaultParser;

        // ...if content-type is not given or unknown
        if ('content-type' in headers && headers['content-type'] in self.parsers) {
          contentType = headers['content-type'];
        }
        
        // and override if set in options
        if ('forceContentType' in options && options.forceContentType in self.parsers) {
          contentType = options.forceContentType;
        }

        self.parsers[contentType](content, function (graph, error) {
          // parser error
          if (error) {
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
      // forward error
      if (error) {
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

    options = options || {};

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

    self.serializers[contentType](graph, function (data, error) {
      // serializer error
      if (error) {
        return callback(null, error);
      }

      self.request(method, iri, headers, data, function (statusCode, headers, content, error) {
        // error during request
        if (error) {
          return callback(null, error);
        }

        // http status code != success
        if (!httpSuccess(statusCode)) {
          return callback(null, 'status code error: ' + statusCode);
        }

        callback(graph);
      });
    });
  };

  self.merge = function (iri, graph, callback, options) {
    var
      contentType = self.defaultPatchSerializer,
      headers = {};

    options = options || {};

    headers['Content-Type'] = contentType;

    if ('etag' in options) {
      headers['If-Match'] = options.etag;
    }

    if ('useEtag' in options && options.useEtag && 'etag' in graph) {
      headers['If-Match'] = graph.etag;
    }

    self.serializers[contentType](graph, function (data, error) {
      // serializer error
      if (error) {
        return callback(null, error);
      }

      self.request('PATCH', iri, headers, data, function (statusCode, headers, content, error) {
          // error during request
          if (error) {
            return callback(null, error);
          }

          // http status code != success
          if (!httpSuccess(statusCode)) {
            return callback(null, 'status code error: ' + statusCode);
          }

          callback(graph);
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
        if (error) {
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
    if (error) {
      return callback(null, error);
    }

    callback('INSERT DATA { ' + nTriples + ' }');
  });
};


LdpStore.defaultParsers = function(rdf) {
  return {
    'application/ld+json': rdf.parseJsonLd,
    'application/n-triples': rdf.parseTurtle,
    'text/turtle': rdf.parseTurtle
  };
};


LdpStore.defaultSerializers = function (rdf) {
  return {
    'application/ld+json': rdf.serializeJsonLd,
    'application/n-triples': rdf.serializeNTriples,
    'application/sparql-update': LdpStore.serializeSparqlUpdate.bind(null, rdf),
    'text/turtle': rdf.serializeNTriples
  };
};


module.exports = function (rdf) {
  rdf.LdpStore = LdpStore.bind(null, rdf);
};
