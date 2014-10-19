var
  config = require(__dirname + '/support/config'),
  rdf = config.rdf,
  store = config.store;

var
  assert = require('assert'),
  fs = require('fs'),
  utils = require('rdf-test-utils')(rdf),
  xmldom = require('xmldom');


describe('rdf-ext', function() {
  var cardGraph = null;

  before(function(done) {
    cardGraph = require(__dirname + '/support/card-graph')(rdf);

    done();
  });

  describe('parsers', function() {
    it('Turtle parser should parse card.ttl', function(done) {
      var
        card = fs.readFileSync(__dirname + '/support/card.ttl').toString(),
        parser = new rdf.TurtleParser();

      parser.parse(card, function(graph) {
        utils.p.assertGraphEqual(graph, cardGraph).then(function() { done(); });
      }, 'https://www.example.com/john/card');
    });

    it('JSON-LD parser should parse card.json', function(done) {
      var
        card = JSON.parse(fs.readFileSync(__dirname + '/support/card.json').toString()),
        parser = new rdf.JsonLdParser();

      parser.parse(card, function(graph) {
        utils.p.assertGraphEqual(graph, cardGraph).then(function() { done(); });
      }, 'https://www.example.com/john/card');
    });

    it('RDF/XML parser should parse card.xml', function(done) {
      var
        card = fs.readFileSync(__dirname + '/support/card.xml').toString(),
        parser = new rdf.RdfXmlParser();

        parser.parse(card, function(graph) {
          utils.p.assertGraphEqual(graph, cardGraph).then(function() { done(); });
        }, 'https://www.example.com/john/card');
    });
  });

  describe('serializers', function () {
    it('JSON-LD serializer should generate parseable card', function(done) {
      var
        serializer = new rdf.JsonLdSerializer();
        parser = new rdf.JsonLdParser();

      serializer.serialize(cardGraph, function(cardJsonLd) {
        parser.parse(cardJsonLd, function(graph) {
          utils.p.assertGraphEqual(graph, cardGraph).then(function() { done(); });
        }, 'https://www.example.com/john/card');
      });
    });
  });
});