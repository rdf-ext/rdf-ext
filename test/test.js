(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    global.Promise = require('es6-promise').Promise;

    var
      assert = require('assert'),
      fs = require('fs'),
      path = require('path'),
      rdf = require('rdf-interfaces'),
      utils = require('rdf-test-utils')(rdf);

    require('../rdf-ext.js')(rdf);

    var readFile = function (filename) {
      return new Promise(function (resolve) {
        resolve(fs.readFileSync(path.join(__dirname, filename)).toString());
      });
    };

    module.exports = factory(assert, jsonld, rdf, readFile, utils);
  } else {
    var readFile = function (filename) {
      return new Promise(function (resolve) {
        root.rdf.defaultRequest('GET', filename, {}, null, function (status, headers, content) {
          resolve(content);
        });
      });
    };

    factory(root.assert, root.jsonld, root.rdf, readFile, root.rdf.testUtils(root.rdf));
  }
})(this, function (assert, jsonld, rdf, readFile, utils) {

  describe('rdf-ext', function() {
    var
      cardGraph;

    var buildCardGraph = function() {
      var graph = rdf.createGraph();

      var cardNode = rdf.createNamedNode('https://www.example.com/john/card#me');

      graph.add(rdf.createTriple(
        cardNode,
        rdf.createNamedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        rdf.createNamedNode('http://xmlns.com/foaf/0.1/Person')));

      graph.add(rdf.createTriple(
        cardNode,
        rdf.createNamedNode('http://xmlns.com/foaf/0.1/name'),
        rdf.createLiteral('John Smith', 'en')));

      var keyNode = rdf.createBlankNode();

      graph.add(rdf.createTriple(
        cardNode,
        rdf.createNamedNode('http://www.w3.org/ns/auth/cert#key'),
        keyNode));

      graph.add(rdf.createTriple(
        keyNode,
        rdf.createNamedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        rdf.createNamedNode('http://www.w3.org/ns/auth/cert#RSAPublicKey')));

      graph.add(rdf.createTriple(
        keyNode,
        rdf.createNamedNode('http://www.w3.org/ns/auth/cert#exponent'),
        rdf.createLiteral('65537', null, rdf.createNamedNode('http://www.w3.org/2001/XMLSchema#integer'))));

      graph.add(rdf.createTriple(
        keyNode,
        rdf.createNamedNode('http://www.w3.org/ns/auth/cert#modulus'),
        rdf.createLiteral('abcdef', null, rdf.createNamedNode('http://www.w3.org/2001/XMLSchema#hexBinary'))));

      return graph;
    };

    before(function(done) {
      cardGraph = buildCardGraph();

      done();
    });

    describe('parsers', function() {
      it('Turtle parser should parse card.ttl', function(done) {
        var parser = new rdf.promise.Parser(new rdf.TurtleParser());

        readFile('support/card.ttl')
          .then(function (card) { return parser.parse(card, 'https://www.example.com/john/card') })
          .then(function (graph) { return  utils.p.assertGraphEqual(graph, cardGraph); })
          .then(function () { done() })
          .catch(function (error) { done(error); });
      });

      it('Turtle parser should forward error', function(done) {
        rdf.parseTurtle('this is not a Turtle string', function (graph, error) {
          assert.equal(graph, null);
          assert.notEqual(error, null);

          done();
        });
      });

      it('JSON-LD parser should parse card.json', function(done) {
        var parser = new rdf.promise.Parser(new rdf.JsonLdParser());

        readFile('support/card.json')
          .then(function (card) { return parser.parse(card, 'https://www.example.com/john/card') })
          .then(function (graph) { return  utils.p.assertGraphEqual(graph, cardGraph); })
          .then(function () { done() })
          .catch(function (error) { done(error); });
      });

      it('JSON-LD parser should forward error', function(done) {
        rdf.parseJsonLd('{"@context": "urn:test"}', function (graph, error) {
          assert.equal(graph, null);
          assert.notEqual(error, null);

          done();
        });
      });

      it('RDF/XML parser should parse card.xml', function(done) {
        var parser = new rdf.promise.Parser(new rdf.RdfXmlParser());

        readFile('support/card.xml')
          .then(function (card) { return parser.parse(card, 'https://www.example.com/john/card') })
          .then(function (graph) { return  utils.p.assertGraphEqual(graph, cardGraph); })
          .then(function () { done() })
          .catch(function (error) { done(error); });
      });

      it('RDF/XML parser should forward error', function(done) {
        rdf.parseTurtle('this is not a RDF/XML string', function (graph, error) {
          assert.equal(graph, null);
          assert.notEqual(error, null);

          done();
        });
      });
    });

    describe('serializers', function () {
      it('Turtle serializer should generate parsable card', function (done) {
        var
          serializer = new rdf.promise.Serializer(new rdf.TurtleSerializer()),
          parser = new rdf.promise.Parser(new rdf.TurtleParser());

        serializer.serialize(cardGraph)
          .then(function (card) { return parser.parse(card, 'https://www.example.com/john/card'); })
          .then(function (graph) { return  utils.p.assertGraphEqual(graph, cardGraph); })
          .then(function () { done() })
          .catch(function (error) { done(error); });
      });

      it('JSON-LD serializer should generate parseable card', function(done) {
        var
          serializer = new rdf.promise.Serializer(new rdf.JsonLdSerializer()),
          parser = new rdf.promise.Parser(new rdf.JsonLdParser());

        serializer.serialize(cardGraph)
          .then(function (card) { return parser.parse(card, 'https://www.example.com/john/card'); })
          .then(function (graph) { return  utils.p.assertGraphEqual(graph, cardGraph); })
          .then(function () { done() })
          .catch(function (error) { done(error); });
      });
    });

    /*describe('microdata-rdf test suite', function () {
      var
        tests = [
          '0001', '0002', '0003', '0004', '0005', '0006', '0007', '0008', '0009', '0010', '0011', '0012', '0013',
          '0014', '0015', '0046', '0047', '0048', '0049', '0050', '0051', '0052', '0053', '0054', '0055', '0056',
          '0057', '0058', '0059', '0060', '0061', '0062', '0063', '0064', '0065', '0066', '0067', '0068', '0069',
          '0070', '0073', '0074', '0075', '0076', '0077', '0078', '0079', '0080', '0081', '0082', '0083', '0084' ],
        microdataParser = new rdf.promise.Parser(new rdf.MicrodataParser()),
        turtleParser = new rdf.promise.Parser(new rdf.TurtleParser());

      var runTest = function (number) {
        it('should pass test ' + number, function (done) {

          Promise.all([
            readFile('support/microdata-rdf/' + number + '.html'),
            readFile('support/microdata-rdf/' + number + '.ttl')
          ]).then(function (contents) {
            return Promise.all([
              microdataParser.parse(contents[0], 'http://example.com/' + number + '.html'),
              turtleParser.parse(contents[1], 'http://example.com/' + number + '.html')
            ])
          }).then(function (graphs) {
            return utils.p.assertGraphEqual(graphs[0], graphs[1]);
          }).then(function () {
            done()
          }).catch(function (error) {
            done(error);
          })
        });
      };

      tests.forEach(function (number) {
        runTest(number);
      })
    });*/
  });
});