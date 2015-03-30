(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.tests = root.tests || {};
    root.tests.graph = factory();
  }
})(this, function () {
  return function (assert, rdf, readFile, utils, ctx) {
    describe('Graph', function () {
      it('difference should return triples of graph a not in graph b', function () {
        var
          a = rdf.createGraph(),
          b = rdf.createGraph();

        a.add(ctx.triples.t1);
        a.add(ctx.triples.t2);

        b.add(ctx.triples.t2);

        var difference = rdf.Graph.difference(a, b);

        assert.equal(difference.length, 1, 'difference graph should contain 1 triple');
        assert.equal(difference.toArray()[0].equals(ctx.triples.t1), true, 'that triple should be equal t1');
      });

      it('intersection should return triples of graph a that are also present in graph b', function () {
        var
          a = rdf.createGraph(),
          b = rdf.createGraph();

        a.add(ctx.triples.t1);
        a.add(ctx.triples.t2);

        b.add(ctx.triples.t1);

        var intersection = rdf.Graph.intersection(a, b);

        assert.equal(intersection.length, 1, 'intersection graph should contain 1 triple');
        assert.equal(intersection.toArray()[0].equals(ctx.triples.t1), true, 'that triple should be equal t1');
      });

      it('map should map triples of graph via callback function', function () {
        var a = rdf.createGraph();

        a.add(ctx.triples.t1);
        a.add(ctx.triples.t2);

        var mapped = rdf.Graph
          .map(a, function (t) {
            return t.subject.toString();
          })
          .join(',');

        var subjectJoin = [
          ctx.triples.t1.subject.toString(),
          ctx.triples.t2.subject.toString()
        ].join(',');

        assert.equal(mapped, subjectJoin, 'mapped value should contain joined subject strings');
      });

      it('merge should create a new graph that contains triples of graph a and graph b', function () {
        var
          a = rdf.createGraph(),
          b = rdf.createGraph();

        a.add(ctx.triples.t1);
        a.add(ctx.triples.t2);

        b.add(ctx.triples.t2);
        b.add(ctx.triples.t3);

        var merged = rdf.Graph.merge(a, b);

        assert.equal(merged.length, 3, 'should contain all triples of a and b, but no duplicates');
      });

      it('toString should return a N-Triples representation of the graph', function () {
        var a = rdf.createGraph();

        a.add(ctx.triples.t1);
        a.add(ctx.triples.t2);

        var nTriples = a.toString();

        assert.equal(nTriples, '<http://example.org/1> <http://example.org/3> <http://example.org/2> .\n<http://example.org/2> <http://example.org/4> _:b2 .\n');
      });
    });
  };
});