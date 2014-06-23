# RDF Interfaces Extension

This module implements [RDF-Ext] (http://bergos.github.com/rdf-ext-spec/),
parsers (JSON-LD, RDF-XML, Turtle),
serializers (JSON-LD, N-Triples) and
stores (in memory, LDP, SPARQL).

## Usage

### node.js

Import your favourite RDF Interfaces library:

	var rdf = require('rdf-interfaces');

Mixin RDF Interfaces Extension to the RDF Environment:

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