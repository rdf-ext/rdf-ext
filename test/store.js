var config = require(__dirname + '/support/config');
var rdf = config.rdf;
var store = config.store;

var assert = require('assert');
var fs = require('fs');
var utils = require('rdf-test-utils')(rdf);


describe('rdf-ext', function() {
	var cardGraph = null;

	before(function(done) {
		cardGraph = require(__dirname + '/support/card-graph')(rdf);

		done();
	});

	describe('store', function() {
		it('graph', function(done) {
			store.add('https://www.example.com/john/card1', cardGraph, function(added) {
				store.graph('https://www.example.com/john/card1', function(graph) {
					utils.p.assertGraphEqual(graph, cardGraph).then(function() { done(); });
				});
			});
		});

		it('match', function(done) {
			var s = 'https://www.example.com/john/card#me';
			var p = 'http://xmlns.com/foaf/0.1/name';
			var o = null;

			store.add('https://www.example.com/john/card2', cardGraph, function(added) {
				store.match('https://www.example.com/john/card2', s, p, o, function(graph) {
					utils.p.assertGraphEqual(graph, cardGraph.match(s, p, o)).then(function() { done(); });
				});
			});
		});

		it('add', function(done) {
			var initial = rdf.createGraph();

			initial.add(rdf.createTriple(
				rdf.createNamedNode('https://www.example.com/john/card#me'),
				rdf.createNamedNode('http://xmlns.com/foaf/0.1/nick'),
				rdf.createLiteral('Johnny')));

			store.add('https://www.example.com/john/card3', initial, function(added) {
				utils.p.assertGraphEqual(added, initial).then(function() {
					store.add('https://www.example.com/john/card3', cardGraph, function(added) {
						utils.p.assertGraphEqual(added, cardGraph).then(function() {
							store.graph('https://www.example.com/john/card3', function(graph) {
								utils.p.assertGraphEqual(graph, cardGraph).then(function() { done(); });
							});
						});
					});
				});
			});
		});

		it('merge', function(done) {
			var toMerge = rdf.createGraph();

			toMerge.add(rdf.createTriple(
				rdf.createNamedNode('https://www.example.com/john/card#me'),
				rdf.createNamedNode('http://xmlns.com/foaf/0.1/nick'),
				rdf.createLiteral('Johnny')));

			var final = rdf.Graph.merge(cardGraph, toMerge);

			store.add('https://www.example.com/john/card4', cardGraph, function(added) {
				store.merge('https://www.example.com/john/card4', toMerge, function(merged) {
					utils.p.assertGraphEqual(merged, toMerge).then(function() {
						store.graph('https://www.example.com/john/card4', function(graph) {
							utils.p.assertGraphEqual(graph, final).then(function() { done(); });
						});
					});
				});
			});
		});

		it('remove', function(done) {
			var toRemove = rdf.createGraph();

			toRemove.add(rdf.createTriple(
				rdf.createNamedNode('https://www.example.com/john/card#me'),
				rdf.createNamedNode('http://xmlns.com/foaf/0.1/name'),
				rdf.createLiteral('John Smith')));

			var final = rdf.Graph.difference(cardGraph, toRemove);

			store.add('https://www.example.com/john/card5', cardGraph, function(added) {
				store.remove('https://www.example.com/john/card5', toRemove, function(removed) {
					assert.equal(removed, true);

					store.graph('https://www.example.com/john/card5', function(graph) {
						utils.p.assertGraphEqual(graph, final).then(function() { done(); });
					});
				});
			});
		});

		it('removeMatches', function(done) {
			var s = 'https://www.example.com/john/card#me';
			var p = 'http://xmlns.com/foaf/0.1/name';
			var o = null;
			var toRemove = rdf.createGraph();

			toRemove.add(rdf.createTriple(
				rdf.createNamedNode('https://www.example.com/john/card#me'),
				rdf.createNamedNode('http://xmlns.com/foaf/0.1/name'),
				rdf.createLiteral('John Smith', 'en')));

			var final = rdf.Graph.difference(cardGraph, toRemove);

			store.add('https://www.example.com/john/card6', cardGraph, function(added) {
				store.removeMatches('https://www.example.com/john/card6', s, p, o, function(removed) {
					assert.equal(removed, true);

					store.graph('https://www.example.com/john/card6', function(graph) {
						utils.p.assertGraphEqual(graph, final).then(function() { done(); });
					});
				});
			});
		});

		it('delete', function(done) {
			store.add('https://www.example.com/john/card7', cardGraph, function(added) {
				store.delete('https://www.example.com/john/card7', function(deleted) {
					assert.equal(deleted, true);

					store.graph('https://www.example.com/john/card7', function(graph) {
						utils.p.assertGraphEmpty(graph).then(function() { done(); });
					});
				});
			});
		});
	});
});