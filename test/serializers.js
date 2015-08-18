(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.tests = root.tests || {};
    root.tests.serializers = factory();
  }
})(this, function () {
  return function (assert, rdf, readFile, utils, ctx) {
    describe('serializers', function () {
      it('N-Triples serializer should generate parsable card', function (done) {
        var
          serializer = new rdf.promise.Serializer(new rdf.NTriplesSerializer()),
          parser = new rdf.promise.Parser(new rdf.NTriplesParser());

        serializer.serialize(ctx.cardGraph)
          .then(function (card) {
            return parser.parse(card, 'https://www.example.com/john/card');
          })
          .then(function (graph) {
            return utils.p.assertGraphEqual(graph, ctx.cardGraph);
          })
          .then(function () {
            done()
          })
          .catch(function (error) {
            done(error);
          });
      });

      it('SPARQL Update serializer should generate parsable card', function (done) {
        var
          serializer = new rdf.promise.Serializer(new rdf.SparqlUpdateSerializer()),
          parser = new rdf.promise.Parser(new rdf.NTriplesParser());

        serializer.serialize(ctx.cardGraph)
          .then(function (card) {
            assert.equal(card.substring(0, 13), 'INSERT DATA {');
            assert.equal(card.substring(card.length-1), '}');

            card = card.substring(13, card.length-1).trim();

            return parser.parse(card, 'https://www.example.com/john/card');
          })
          .then(function (graph) {
            return utils.p.assertGraphEqual(graph, ctx.cardGraph);
          })
          .then(function () {
            done()
          })
          .catch(function (error) {
            done(error);
          });
      });

      it('Turtle serializer should generate parsable card', function (done) {
        var
          serializer = new rdf.promise.Serializer(new rdf.TurtleSerializer()),
          parser = new rdf.promise.Parser(new rdf.TurtleParser());

        serializer.serialize(ctx.cardGraph)
          .then(function (card) {
            return parser.parse(card, 'https://www.example.com/john/card');
          })
          .then(function (graph) {
            return utils.p.assertGraphEqual(graph, ctx.cardGraph);
          })
          .then(function () {
            done()
          })
          .catch(function (error) {
            done(error);
          });
      });

      it('JSON-LD serializer should generate parseable card', function (done) {
        var
          serializer = new rdf.promise.Serializer(new rdf.JsonLdSerializer()),
          parser = new rdf.promise.Parser(new rdf.JsonLdParser());

        serializer.serialize(ctx.cardGraph)
          .then(function (card) {
            return parser.parse(card, 'https://www.example.com/john/card');
          })
          .then(function (graph) {
            return utils.p.assertGraphEqual(graph, ctx.cardGraph);
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