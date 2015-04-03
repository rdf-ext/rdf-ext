/* global describe, it */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.tests = root.tests || {};
    root.tests.ldpStore = factory();
  }
})(this, function () {
  return function (assert, rdf, readFile, utils, ctx) {
    var createClient = function (buildResponse) {
      return function (method, url, headers, content, callback) {
        var res = null;

        if (buildResponse != null) {
          res = buildResponse({
            method: method,
            url: url,
            headers: headers,
            content: content
          });
        }

        res = res || {};
        res.statusCode = res.statusCode !== undefined ? res.statusCode : 200;
        res.headers = res.headers || {};
        res.content = res.content || '';

        callback(res.statusCode, res.headers, res.content, res.error);
      };
    };

    var createParser = function (buildGraphData) {
      return function (content, callback, base) {
        var graphData = null;

        if (buildGraphData != null) {
          graphData = buildGraphData({
            content: content,
            base: base
          });
        }

        graphData = graphData || {graph: rdf.createGraph()};

        callback(graphData.graph, graphData.error);
      };
    };

    var createSerializer = function (buildSerializedData) {
      return function (graph, callback) {
        var serializedData = null;

        if (buildSerializedData != null) {
          serializedData = buildSerializedData({
            graph: graph
          });
        }

        serializedData = serializedData || {content: ''};

        callback(serializedData.content, serializedData.error);
      };
    };

    describe('LdpStore', function () {
      describe('graph method', function () {
        it('should use HTTP GET method', function (done) {
          var options = {
            request: createClient(function (req) {
              assert.equal(req.method, 'GET');
            }),
            parsers: {
              '1': createParser()
            },
            defaultParser: '1'
          };

          var store = new rdf.LdpStore(options);

          store.graph('http://example.org/', function () {
            done();
          });
        });

        it('should build accept header', function (done) {
          var options = {
            request: createClient(function (req) {
              assert.equal(req.headers.Accept, 'application/ld+json, text/turtle');
            }),
            parsers: {
              'application/ld+json': null,
              'text/turtle': createParser()
            }
          };

          var store = new rdf.LdpStore(options);

          store.graph('http://example.org/', function () {
            done();
          });
        });

        it('should handle request error', function (done) {
          var options = {
            request: createClient(function () {
              return {error: 'error'}
            })
          };

          var store = new rdf.LdpStore(options);

          store.graph('http://example.org/', function (graph, error) {
            assert.equal(graph, null);
            assert.equal(error != null, true);

            done();
          });
        });

        it('should handle error status code', function (done) {
          var options = {
            request: createClient(function () {
              return {statusCode: 500}
            })
          };

          var store = new rdf.LdpStore(options);

          store.graph('http://example.org/', function (graph, error) {
            assert.equal(graph, null);
            assert.equal(error != null, true);

            done();
          });
        });

        it('should ignore status code 0 (local file system)', function (done) {
          var options = {
            request: createClient(function () {
              return {statusCode: 0}
            })
          };

          var store = new rdf.LdpStore(options);

          store.graph('http://example.org/', function (graph, error) {
            assert.notEqual(graph, null);
            assert.equal(error != null, false);

            done();
          });
        });

        it('should use default content type if none given', function (done) {
          var options = {
            request: createClient(),
            parsers: {
              '1': createParser(function () {
                assert(false);
              }),
              '2': createParser(function () {
                assert(true);
              })
            },
            defaultParser: '2'
          };

          var store = new rdf.LdpStore(options);

          store.graph('http://example.org/', function () {
            done();
          });
        });

        it('should use default content type if unknown is given', function (done) {
          var options = {
            request: createClient(function () {
              return {headers: {'content-type': '3'}}
            }),
            parsers: {
              '1': createParser(function () {
                assert(false);
              }),
              '2': createParser(function () {
                assert(true);
              })
            },
            defaultParser: '2'
          };

          var store = new rdf.LdpStore(options);

          store.graph('http://example.org/', function () {
            done();
          });
        });

        it('should use parser for defined content type', function (done) {
          var options = {
            request: createClient(function () {
              return {headers: {'content-type': '2'}}
            }),
            parsers: {
              '1': createParser(function () {
                assert(false);
              }),
              '2': createParser(function () {
                assert(true);
              })
            }
          };

          var store = new rdf.LdpStore(options);

          store.graph('http://example.org/', function () {
            done();
          });
        });

        it('should ignore content type header if forceContentType is set', function (done) {
          var options = {
            request: createClient(function () {
              return {headers: {'content-type': '1'}}
            }),
            parsers: {
              '1': createParser(function () {
                assert(false);
              }),
              '2': createParser(function () {
                assert(true);
              })
            }
          };

          var store = new rdf.LdpStore(options);

          store.graph('http://example.org/', function () {
            done();
          }, {forceContentType: '2'});
        });

        it('should handle parser error', function (done) {
          var options = {
            request: createClient(),
            parsers: {
              '1': createParser(function () {
                return {graph: null, error: 'error'};
              })
            },
            defaultParser: '1'
          };

          var store = new rdf.LdpStore(options);

          store.graph('http://example.org/', function (graph, error) {
            assert.equal(graph, null);
            assert.equal(error != null, true);

            done();
          });
        });

        it('should use parsers base parameter', function (done) {
          var options = {
            request: createClient(),
            parsers: {
              '1': createParser(function (serializedData) {
                assert.equal(serializedData.base, 'http://example.org/');
              })
            },
            defaultParser: '1'
          };

          var store = new rdf.LdpStore(options);

          store.graph('http://example.org/', function (graph, error) {
            assert.notEqual(graph, null);
            assert.equal(error != null, false);

            done();
          });
        });

        it('should return a graph object', function (done) {
          var options = {
            request: createClient(),
            parsers: {
              '1': createParser()
            },
            defaultParser: '1'
          };

          var store = new rdf.LdpStore(options);

          store.graph('http://example.org/', function (graph, error) {
            assert.equal(graph.length, 0);
            assert.notEqual(graph.actions, null);
            assert.equal(error != null, false);

            done();
          });
        });

        it('should set eTag property', function (done) {
          var options = {
            request: createClient(function () {
              return {headers: {'etag': 'test'}};
            }),
            parsers: {
              '1': createParser()
            },
            defaultParser: '1'
          };

          var store = new rdf.LdpStore(options);

          store.graph('http://example.org/', function (graph, error) {
            assert.equal(graph.etag, 'test');
            assert.equal(error != null, false);

            done();
          }, {useEtag: true});
        });
      });

      describe('match method', function () {
        it('should handle error', function (done) {
          var options = {
            request: createClient(function () {
              return {error: 'error'};
            })
          };

          var store = new rdf.LdpStore(options);

          store.match('http://example.org/', null, null, null, function (graph, error) {
            assert.equal(graph, null);
            assert.equal(error != null, true);

            done();
          });
        });

        it('should forward parameters to graphs .match method', function (done) {
          var options = {
            request: createClient(),
            parsers: {
              '1': createParser(function () {
                return {
                  graph: {
                    match: function (s, p, o) {
                      assert.equal(s, 's');
                      assert.equal(p, 'p');
                      assert.equal(o, 'o');
                    }
                  }
                }
              })
            },
            defaultParser: '1'
          };

          var store = new rdf.LdpStore(options);

          store.match('http://example.org/', 's', 'p', 'o', function () {
            done();
          });
        });

        it('should return a graph object', function (done) {
          var options = {
            request: createClient(),
            parsers: {
              '1': createParser()
            },
            defaultParser: '1'
          };

          var store = new rdf.LdpStore(options);

          store.match('http://example.org/', null, null, null, function (graph, error) {
            assert.equal(graph.length, 0);
            assert.notEqual(graph.actions, null);
            assert.equal(error != null, false);

            done();
          });
        });
      });

      describe('add method', function () {
        it('should use HTTP PUT method', function (done) {
          var options = {
            request: createClient(function (req) {
              assert.equal(req.method, 'PUT');
            }),
            serializers: {
              '1': createSerializer()
            },
            defaultSerializer: '1'
          };

          var store = new rdf.LdpStore(options);

          store.add('http://example.org/', null, function () {
            done();
          });
        });

        it('should use the content type of defaultSerializer', function (done) {
          var options = {
            request: createClient(function (req) {
              assert.equal(req.headers['Content-Type'], '1');
            }),
            serializers: {
              '1': createSerializer()
            },
            defaultSerializer: '1'
          };

          var store = new rdf.LdpStore(options);

          store.add('http://example.org/', null, function () {
            done();
          });
        });

        it('should use the given HTTP method', function (done) {
          var options = {
            request: createClient(function (req) {
              assert.equal(req.method, 'POST');
            }),
            serializers: {
              '1': createSerializer()
            },
            defaultSerializer: '1'
          };

          var store = new rdf.LdpStore(options);

          store.add('http://example.org/', null, function () {
            done();
          }, {method: 'POST'});
        });

        it('should use if-match header if etag is given', function (done) {
          var options = {
            request: createClient(function (req) {
              assert.equal(req.headers['If-Match'], 'test');
            }),
            serializers: {
              '1': createSerializer()
            },
            defaultSerializer: '1'
          };

          var store = new rdf.LdpStore(options);

          store.add('http://example.org/', null, function () {
            done();
          }, {etag: 'test'});
        });

        it('should use if-match header if graph has a etag property and useEtag is set', function (done) {
          var options = {
            request: createClient(function (req) {
              assert.equal(req.headers['If-Match'], 'test');
            }),
            serializers: {
              '1': createSerializer()
            },
            defaultSerializer: '1'
          };

          var store = new rdf.LdpStore(options);

          store.add('http://example.org/', {etag: 'test'}, function () {
            done();
          }, {useEtag: true});
        });

        it('should not use if-match header if graph has a etag property, but useEtag is not set', function (done) {
          var options = {
            request: createClient(function (req) {
              assert.notEqual(req.headers['If-Match'], 'test');
            }),
            serializers: {
              '1': createSerializer()
            },
            defaultSerializer: '1'
          };

          var store = new rdf.LdpStore(options);

          store.add('http://example.org/', {etag: 'test'}, function () {
            done();
          });
        });

        it('should handle serializer error', function (done) {
          var options = {
            request: createClient(),
            serializers: {
              '1': createSerializer(function () {
                return {error: 'error'};
              })
            },
            defaultSerializer: '1'
          };

          var store = new rdf.LdpStore(options);

          store.add('http://example.org/', null, function (graph, error) {
            assert.equal(graph, null);
            assert.equal(error != null, true);

            done();
          });
        });

        it('should handle request error', function (done) {
          var options = {
            request: createClient(function () {
              return {error: 'error'};
            }),
            serializers: {
              '1': createSerializer()
            },
            defaultSerializer: '1'
          };

          var store = new rdf.LdpStore(options);

          store.add('http://example.org/', null, function (graph, error) {
            assert.equal(graph, null);
            assert.equal(error != null, true);

            done();
          });
        });

        it('should handle status code error', function (done) {
          var options = {
            request: createClient(function () {
              return {statusCode: 500};
            }),
            serializers: {
              '1': createSerializer()
            },
            defaultSerializer: '1'
          };

          var store = new rdf.LdpStore(options);

          store.add('http://example.org/', null, function (graph, error) {
            assert.equal(graph, null);
            assert.equal(error != null, true);

            done();
          });
        });

        it('should return the input graph object', function (done) {
          var options = {
            request: createClient(),
            serializers: {
              '1': createSerializer()
            },
            defaultSerializer: '1'
          };

          var store = new rdf.LdpStore(options);

          store.add('http://example.org/', 'test', function (graph, error) {
            assert.equal(graph, 'test');
            assert.equal(error != null, false);

            done();
          });
        });


      });

      describe('merge method', function () {
        it('should use HTTP PATCH method', function (done) {
          var options = {
            request: createClient(function (req) {
              assert.equal(req.method, 'PATCH');
            }),
            serializers: {
              '1': createSerializer()
            },
            defaultSerializer: '1'
          };

          var store = new rdf.LdpStore(options);

          store.merge('http://example.org/', null, function () {
            done();
          });
        });

        it('should use SPARQL Update content type', function (done) {
          var options = {
            request: createClient(function (req) {
              assert.equal(req.headers['Content-Type'], '1');
            }),
            serializers: {
              '1': createSerializer()
            },
            defaultSerializer: '1'
          };

          var store = new rdf.LdpStore(options);

          store.merge('http://example.org/', null, function () {
            done();
          });
        });

        it('should use if-match header if etag is given', function (done) {
          var options = {
            request: createClient(function (req) {
              assert.equal(req.headers['If-Match'], 'test');
            }),
            serializers: {
              '1': createSerializer()
            },
            defaultSerializer: '1'
          };

          var store = new rdf.LdpStore(options);

          store.merge('http://example.org/', null, function () {
            done();
          }, {etag: 'test'});
        });

        it('should use if-match header if graph has a etag property and useEtag is set', function (done) {
          var options = {
            request: createClient(function (req) {
              assert.equal(req.headers['If-Match'], 'test');
            }),
            serializers: {
              '1': createSerializer()
            },
            defaultSerializer: '1'
          };

          var store = new rdf.LdpStore(options);

          store.merge('http://example.org/', {etag: 'test'}, function () {
            done();
          }, {useEtag: true});
        });

        it('should not use if-match header if graph has a etag property, but useEtag is not set', function (done) {
          var options = {
            request: createClient(function (req) {
              assert.notEqual(req.headers['If-Match'], 'test');
            }),
            serializers: {
              '1': createSerializer()
            },
            defaultSerializer: '1'
          };

          var store = new rdf.LdpStore(options);

          store.merge('http://example.org/', {etag: 'test'}, function () {
            done();
          });
        });

        it('should handle serializer error', function (done) {
          var options = {
            request: createClient(),
            serializers: {
              '1': createSerializer(function () {
                return {error: 'error'};
              })
            },
            defaultSerializer: '1'
          };

          var store = new rdf.LdpStore(options);

          store.merge('http://example.org/', null, function (graph, error) {
            assert.equal(graph, null);
            assert.equal(error != null, true);

            done();
          });
        });

        it('should handle request error', function (done) {
          var options = {
            request: createClient(function () {
              return {error: 'error'};
            }),
            serializers: {
              '1': createSerializer()
            },
            defaultSerializer: '1'
          };

          var store = new rdf.LdpStore(options);

          store.merge('http://example.org/', null, function (graph, error) {
            assert.equal(graph, null);
            assert.equal(error != null, true);

            done();
          });
        });

        it('should handle status code error', function (done) {
          var options = {
            request: createClient(function () {
              return {statusCode: 500};
            }),
            serializers: {
              '1': createSerializer()
            },
            defaultSerializer: '1'
          };

          var store = new rdf.LdpStore(options);

          store.merge('http://example.org/', null, function (graph, error) {
            assert.equal(graph, null);
            assert.equal(error != null, true);

            done();
          });
        });

        it('should return the input graph object', function (done) {
          var options = {
            request: createClient(),
            serializers: {
              '1': createSerializer()
            },
            defaultSerializer: '1'
          };

          var store = new rdf.LdpStore(options);

          store.merge('http://example.org/', 'test', function (graph, error) {
            assert.equal(graph, 'test');
            assert.equal(error != null, false);

            done();
          });
        });
      });

      describe('remove method', function () {

      });

      describe('removeMatches method', function () {

      });

      describe('delete method', function () {
        it('should use HTTP DELETE method', function (done) {
          var options = {
            request: createClient(function (req) {
              assert.equal(req.method, 'DELETE');
            })
          };

          var store = new rdf.LdpStore(options);

          store.delete('http://example.org/', function () {
            done();
          });
        });

        it('should handle request error', function (done) {
          var options = {
            request: createClient(function () {
              return {error: 'error'};
            })
          };

          var store = new rdf.LdpStore(options);

          store.delete('http://example.org/', function (success) {
            assert.equal(success, false);

            done();
          });
        });

        it('should handle status code error', function (done) {
          var options = {
            request: createClient(function () {
              return {statusCode: 500};
            })
          };

          var store = new rdf.LdpStore(options);

          store.delete('http://example.org/', function (success) {
            assert.equal(success, false);

            done();
          });
        });

        it('should return true on success', function (done) {
          var options = {
            request: createClient()
          };

          var store = new rdf.LdpStore(options);

          store.delete('http://example.org/', function (success) {
            assert.equal(success, true);

            done();
          });
        });
      });
    });
  };
});