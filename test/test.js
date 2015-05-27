(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    global.Promise = require('es6-promise').Promise;

    var
      assert = require('assert'),
      fs = require('fs'),
      path = require('path'),
      rdf = require('../rdf-ext')(),
      utils = require('rdf-test-utils')(rdf);

    var tests = {
      clownface: require('./clownface'),
      graph: require('./graph'),
      ldpStore: require('./ldp-store'),
      microdataSuite: require('./microdata-suite'),
      parsers: require('./parsers'),
      rdfaSuite: require('./rdfa-suite'),
      serializers: require('./serializers'),
      store: require('./store'),
      utils: require('./utils')
    };

    var readFile = function (filename) {
      return new Promise(function (resolve) {
        resolve(fs.readFileSync(path.join(__dirname, filename)).toString());
      });
    };

    module.exports = factory(assert, rdf, readFile, utils, tests);
  } else {
    var readFile = function (filename) {
      return new Promise(function (resolve) {
        root.rdf.defaultRequest('GET', filename, {}, null, function (status, headers, content) {
          resolve(content);
        });
      });
    };

    factory(root.assert, root.rdf, readFile, root.rdf.testUtils(root.rdf), root.tests);
  }
})(this, function (assert, rdf, readFile, utils, tests) {
  var buildCardGraph = function () {
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

  var ctx = {};

  ctx.cardGraph = buildCardGraph();
  //TODO:
  //ctx.listGraph = buildListGraph();

  ctx.nodes = {
    blank1: rdf.createBlankNode(),
    blank2: rdf.createBlankNode(),
    blank3: rdf.createBlankNode(),
    blank4: rdf.createBlankNode(),
    literal1: rdf.createLiteral('example1'),
    literal2: rdf.createLiteral('example2'),
    literal3: rdf.createLiteral('example3'),
    literal4: rdf.createLiteral('example4'),
    named1: rdf.createNamedNode('http://example.org/1'),
    named2: rdf.createNamedNode('http://example.org/2'),
    named3: rdf.createNamedNode('http://example.org/3'),
    named4: rdf.createNamedNode('http://example.org/4')
  };

  ctx.triples = {
    t1: rdf.createTriple(ctx.nodes.named1, ctx.nodes.named3, ctx.nodes.named2),
    t2: rdf.createTriple(ctx.nodes.named2, ctx.nodes.named4, ctx.nodes.blank1),
    t3: rdf.createTriple(ctx.nodes.blank1, ctx.nodes.named3, ctx.nodes.blank2),
    t4: rdf.createTriple(ctx.nodes.blank2, ctx.nodes.named4, ctx.nodes.named1)
  };

  describe('core', function () {
    tests.graph(assert, rdf, readFile, utils, ctx);
    tests.store(assert, rdf, readFile, utils, ctx);
  });

  describe('ext', function() {
    before(function (done) {
      var parser = new rdf.promise.Parser(new rdf.TurtleParser());

      readFile('support/list.nt')
        .then(function (list) {
          return parser.parse(list, 'https://example.com/list')
            .then(function (graph) {
              ctx.listGraph = graph;
            });
        })
        .then(function () {
          return readFile('support/tbbt.nt')
            .then(function (tbbt) {
              return parser.parse(tbbt)
            })
            .then(function (graph) {
              ctx.tbbtGraph = graph;

              return rdf.utils.splitGraphByNamedNodeSubject(graph)
                .then(function (store) {
                  ctx.tbbtStore = store;
                });
            });
        })
        .then(function () {
          done();
        })
        .catch(function (error) {
          done(error);
        });
    });

    tests.parsers(assert, rdf, readFile, utils, ctx);
    tests.serializers(assert, rdf, readFile, utils, ctx);
    tests.ldpStore(assert, rdf, readFile, utils, ctx);
    tests.utils(assert, rdf, readFile, utils, ctx);
    tests.clownface(assert, rdf, readFile, utils, ctx);
  });

  describe('test suites', function () {
    tests.microdataSuite(assert, rdf, readFile, utils, ctx);

    if (rdf.isNode) {
      tests.rdfaSuite(assert, rdf, readFile, utils, ctx);
    }
  });
});