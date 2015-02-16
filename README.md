# RDF Interfaces Extension

This module implements [RDF-Ext] (http://bergos.github.com/rdf-ext-spec/),
parsers (JSON-LD, RDF-XML, Turtle),
serializers (JSON-LD, N-Triples, Turtle) and
stores (in memory, LDP, SPARQL).

RDF-Ext requires a library which implements the W3C [RDF Interfaces](http://www.w3.org/TR/rdf-interfaces/) API.
Here is a list of known working implementations:

* [reference implementation] (https://github.com/bergos/rdf-interfaces)
* [rdf] (https://github.com/Acubed/node-rdf)
* [rdfstore-js] (https://github.com/antoniogarrote/rdfstore-js)

## Usage

### node.js

RDF-Ext is available on `npm`, to install it run:

	npm install rdf-ext

followed by your favourite RDF Interfaces library. If you don't want to chose your own simply run:

	npm install rdf-interfaces

In the code, import the RDF Interfaces library:

	var rdf = require('rdf-interfaces');

And mixin the RDF Interfaces Extension to the RDF Environment:

	require('rdf-ext')(rdf);


### Browser

Import your favourite RDF Interfaces library:

	<script src="/js/rdf.js"></script>

If you want to use the Turtle or JSON-LD parser:

	<script src="/js/n3-browser.js"></script>
	<script src="/js/jsonld.js"></script>

Because rdfstore-js comes with an outdated version of jsonld it must be deleted afterwards:

	<script src="/js/rdfstore.js"></script>
	<script>delete jsonld;</script>

Now you can import RDF-Ext:

	<script src="/js/rdf-ext.js"></script>


## Examples

Use the global turtle parser instance to parse a triple from turtle data string and print the number of triples:

	var data = '<http://example.org/#s> <http://example.org/#p> <http://example.org/#o>.';

	rdf.parseTurtle(data, function (graph) {
	  console.log(graph.length);
	});


Use a `LdpStore` instance to read the http://dbpedia.org/resource/RDF graph from the turtle resource on DBpedia and
print the first rdfs:label object value:

	var store = new rdf.LdpStore();

	store.match(
	  'http://dbpedia.org/data/RDF.ttl',
	  'http://dbpedia.org/resource/RDF',
	  'http://www.w3.org/2000/01/rdf-schema#label',
	  null,
	  function (graph) {
	    console.log(graph.toArray()[0].object.toString());
	  }
	);



## Implementations

### InMemoryStore

A simple in memory triple store implementation.

### LdpStore

Store implementation to access graphs with RESTful interface.

### RdfstoreStore

Store based on [rdfstore-js] (https://github.com/antoniogarrote/rdfstore-js). 

### SingleGraphStore

In memory triple store using a single graph for all named graphs.
Sometimes usefull for testing.

### SparqlStore

Store implementation to access graph with HTTP/SPARQL interface.

### JsonLdParser

Parser for JSON-LD using the standard [JSON-LD library] (https://github.com/digitalbazaar/jsonld.js). 

### RdfXmlParser

Parser for RDF-XML data using a fork of the [rdflib.js] (https://github.com/linkeddata/rdflib.js) parser.

### TurtleParser

Turtle parser using [N3.js] (https://github.com/RubenVerborgh/N3.js).

### JsonLdSerializer

JSON-LD serializer exports expanded JSON-LD data. 

### NTriplesSerializer

N-Triples serializer using the RDF-Ext `Graph.toString()` function.
