(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.tests = root.tests || {};
    root.tests.parsers = factory();
  }
})(this, function () {
  return function (assert, rdf, readFile, utils, ctx) {
    describe('parsers', function () {
      it('Turtle parser should parse card.ttl', function (done) {
        var parser = new rdf.promise.Parser(new rdf.TurtleParser());

        if (rdf.prefixes.cert) {
          delete rdf.prefixes.cert;
        }

        if (rdf.prefixes.foaf) {
          delete rdf.prefixes.foaf;
        }

        readFile('support/card.ttl')
          .then(function (card) {
            return parser.parse(card, 'https://www.example.com/john/card')
          })
          .then(function (graph) {
            return utils.p.assertGraphEqual(graph, ctx.cardGraph);
          })
          .then(function () {
            assert.equal(rdf.prefixes.cert, 'http://www.w3.org/ns/auth/cert#');
            assert.equal(rdf.prefixes.foaf, 'http://xmlns.com/foaf/0.1/');
          })
          .then(function () {
            done()
          })
          .catch(function (error) {
            done(error);
          });
      });

      it('Turtle parser should forward error', function (done) {
        rdf.parseTurtle('this is not a Turtle string', function (graph, error) {
          assert.equal(graph, null);
          assert.notEqual(error, null);

          done();
        });
      });

      it('JSON-LD parser should parse card.json', function (done) {
        var parser = new rdf.promise.Parser(new rdf.JsonLdParser());

        if (rdf.prefixes.cert) {
          delete rdf.prefixes.cert;
        }

        if (rdf.prefixes.foaf) {
          delete rdf.prefixes.foaf;
        }

        readFile('support/card.json')
          .then(function (card) {
            return parser.parse(card, 'https://www.example.com/john/card')
          })
          .then(function (graph) {
            return utils.p.assertGraphEqual(graph, ctx.cardGraph);
          })
          .then(function () {
            assert.equal(rdf.prefixes.cert, 'http://www.w3.org/ns/auth/cert#');
            assert.equal(rdf.prefixes.foaf, 'http://xmlns.com/foaf/0.1/');
          })
          .then(function () {
            done()
          })
          .catch(function (error) {
            done(error);
          });
      });

      it('JSON-LD parser should forward error', function (done) {
        rdf.parseJsonLd('{"@context": "urn:test"}', function (graph, error) {
          assert.equal(graph, null);
          assert.notEqual(error, null);

          done();
        });
      });

      it('JSON-LD parser should parse list.json', function (done) {
        var parser = new rdf.promise.Parser(new rdf.JsonLdParser());

        readFile('support/list.json')
          .then(function (list) {
            return parser.parse(list, 'https://www.example.com/list')
          })
          .then(function (graph) {
            return utils.p.assertGraphEqual(graph, ctx.listGraph);
          })
          .then(function () {
            done()
          })
          .catch(function (error) {
            done(error);
          });
      });

      it('RDF/XML parser should parse card.xml', function (done) {
        var parser = new rdf.promise.Parser(new rdf.RdfXmlParser());

        readFile('support/card.xml')
          .then(function (card) {
            return parser.parse(card, 'https://www.example.com/john/card')
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

      it('RDF/XML parser should forward error', function (done) {
        rdf.parseTurtle('this is not a RDF/XML string', function (graph, error) {
          assert.equal(graph, null);
          assert.notEqual(error, null);

          done();
        });
      });

      // currently no language support in RDFa parser
      /*it('RDFa parser should parse card.xml', function(done) {
       var parser = new rdf.promise.Parser(new rdf.RdfaParser());

       readFile('support/card.rdfa.html')
       .then(function (card) {
       return parser.parse(card, 'https://www.example.com/john/card')
       })
       .then(function (graph) {
       return utils.p.assertGraphEqual(graph, cardGraph);
       })
       .then(function () {
       done()
       })
       .catch(function (error) {
       done(error);
       });
       });*/
    });
  };
});
