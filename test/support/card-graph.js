var cardGraph = function(rdf) {
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


module.exports = cardGraph;