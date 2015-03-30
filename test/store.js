(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.tests = root.tests || {};
    root.tests.store = factory();
  }
})(this, function () {
  return function (assert, rdf, readFile, utils, ctx) {
    describe('Store', function () {
      it('should return only data of the given named graph', function (done) {
        var
          store = new rdf.promise.Store(rdf.createStore()),
          graphA = rdf.createGraph(),
          graphB = rdf.createGraph();

        graphA.add(rdf.createTriple(
          rdf.createNamedNode('http://example.org/test#s-a'),
          rdf.createNamedNode('http://example.org/test#p'),
          rdf.createNamedNode('http://example.org/test#o')));

        graphB.add(rdf.createTriple(
          rdf.createNamedNode('http://example.org/test#s-b'),
          rdf.createNamedNode('http://example.org/test#p'),
          rdf.createNamedNode('http://example.org/test#o')));

        store.add('http://example.org/test-a', graphA)
          .then(function () {
            return store.add('http://example.org/test-b', graphB);
          })
          .then(function () {
            return store.graph('http://example.org/test-b');
          })
          .then(function (graph) {
            assert.equal(graph.length, 1);
            assert(graph.some(function (t) {
              return t.subject.equals('http://example.org/test#s-b')
            }));
          })
          .then(function () {
            done()
          })
          .catch(function (error) {
            done(error);
          });
      });

      it('should return data of all graphs', function (done) {
        var
          store = new rdf.promise.Store(rdf.createStore()),
          graphA = rdf.createGraph(),
          graphB = rdf.createGraph();

        graphA.add(rdf.createTriple(
          rdf.createNamedNode('http://example.org/test#s-a'),
          rdf.createNamedNode('http://example.org/test#p'),
          rdf.createNamedNode('http://example.org/test#o')));

        graphB.add(rdf.createTriple(
          rdf.createNamedNode('http://example.org/test#s-b'),
          rdf.createNamedNode('http://example.org/test#p'),
          rdf.createNamedNode('http://example.org/test#o')));

        store.add('http://example.org/test-a', graphA)
          .then(function () {
            return store.add('http://example.org/test-b', graphB);
          })
          .then(function () {
            return store.graph(undefined);
          })
          .then(function (graph) {
            assert.equal(graph.length, 2);
            assert(graph.some(function (t) {
              return t.subject.equals('http://example.org/test#s-a')
            }));
            assert(graph.some(function (t) {
              return t.subject.equals('http://example.org/test#s-b')
            }));
          })
          .then(function () {
            done()
          })
          .catch(function (error) {
            done(error);
          });
      });

      it('should run match over all graphs', function (done) {
        var
          store = new rdf.promise.Store(rdf.createStore()),
          graphA = rdf.createGraph(),
          graphB = rdf.createGraph();

        graphA.add(rdf.createTriple(
          rdf.createNamedNode('http://example.org/test#s-a'),
          rdf.createNamedNode('http://example.org/test#p'),
          rdf.createNamedNode('http://example.org/test#o')));

        graphB.add(rdf.createTriple(
          rdf.createNamedNode('http://example.org/test#s-b'),
          rdf.createNamedNode('http://example.org/test#p'),
          rdf.createNamedNode('http://example.org/test#o')));

        store.add('http://example.org/test-a', graphA)
          .then(function () {
            return store.add('http://example.org/test-b', graphB);
          })
          .then(function () {
            return store.match(undefined, 'http://example.org/test#s-b');
          })
          .then(function (graph) {
            assert.equal(graph.length, 1);
            assert(graph.some(function (t) {
              return t.subject.equals('http://example.org/test#s-b')
            }));
          })
          .then(function () {
            done()
          })
          .catch(function (error) {
            done(error);
          });
      });
    });
  };
});