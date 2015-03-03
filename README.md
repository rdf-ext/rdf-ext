# RDF Interfaces Extension

RDF-Ext provides a JavaScript library for working with RDF & Linked Data. It provides read/write support for the most widely used RDF data formats like:

### Parsing
* JSON-LD
* Turtle
* N-Triples
* RDF/XML

### Serializing
* JSON-LD
* N-Triples
* Turtle

### Stores

For persistence, RDF-Ext provides several store implementations. One can use the same API for interacting with RDF in JavaScript independent of the persistence layer.

* In-memory
* Linked Data Platform ([LDP](http://www.w3.org/TR/ldp/))
* SPARQL (using an external triple store)

## Design

[RDF-Ext](http://bergos.github.io/rdf-ext-spec/) is an extension of the [RDF Interfaces](http://www.w3.org/TR/rdf-interfaces/) specification. The RDF Interfaces specification defines interfaces for graphs, triples, nodes and parsers/serializers. However, the spec does not define an interface to access triplestores using NamedGraph IRIs. RDF-Ext fills this gap by providing a definition of a [Store](http://bergos.github.io/rdf-ext-spec/#store-1)-Interface with an asynchronous API.

The motivation for an asynchronous API is simple: A JSON-LD context for example can be defined as an URL. The parsing and serialization process must therefore be asynchronous. The RDF-Ext spec contains an extended interface for parsers and serializers to work asynchronously.

With ECMAScript 6 (ES6) JavaScript introduces some new features. RDF-Ext uses the new [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) feature to handle asynchronous function calls easier.

## Requirements

RDF-Ext requires a library, which implements the W3C [RDF Interfaces](http://www.w3.org/TR/rdf-interfaces/) API.
Here is a list of known working implementations:

* [reference implementation](https://github.com/bergos/rdf-interfaces)
* [rdf](https://github.com/Acubed/node-rdf)
* [rdfstore-js](https://github.com/antoniogarrote/rdfstore-js)

## Usage

In general, consult the documentation for the [RDF Interfaces](http://www.w3.org/TR/rdf-interfaces/) and [RDF-Ext](http://bergos.github.io/rdf-ext-spec/) specifications for details about how to interact with the library.

### node.js

RDF-Ext is available on `npm`, to install it run:

	npm install rdf-ext

followed by your favorite RDF Interfaces library. If you don't want to chose your own simply run:

	npm install rdf-interfaces

In the code, import the RDF Interfaces library:

	var rdf = require('rdf-interfaces');

And mixin the RDF Interfaces Extension to the RDF Environment:

	require('rdf-ext')(rdf);


### Browser

Import your favorite RDF Interfaces library:

	<script src="/js/rdf.js"></script>

If you want to use the Turtle or JSON-LD parser:

	<script src="/js/n3-browser.js"></script>
	<script src="/js/jsonld.js"></script>

Because rdfstore-js comes with an outdated version of JSON-LD it must be deleted afterwards:

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

## Support

Issues & feature requests should be reported on Github.

Pull requests are very welcome.

## Implementations

### Store

#### InMemoryStore

A simple in-memory triple store implementation.

#### LdpStore

Store implementation to access graphs via a RESTful [LDP](http://www.w3.org/TR/ldp/) interface.

#### RdfstoreStore

Store based on [rdfstore-js](https://github.com/antoniogarrote/rdfstore-js). 

#### SingleGraphStore

In memory triple store using a single graph for all named graphs.
Sometimes usefull for testing.

#### SparqlStore

Store implementation to access graphs via [SPARQL 1.1 Graph Store HTTP Protocol](http://www.w3.org/TR/sparql11-http-rdf-update/) interface. This requires an external triple store.

### Parser

#### JsonLdParser

Parser for JSON-LD using the standard [JSON-LD library](https://github.com/digitalbazaar/jsonld.js). 

#### RdfXmlParser

Parser for RDF/XML data using a fork of the [rdflib.js](https://github.com/linkeddata/rdflib.js) parser.

#### TurtleParser

Turtle parser using [N3.js](https://github.com/RubenVerborgh/N3.js).

### Serializer

#### JsonLdSerializer

JSON-LD serializer exports expanded JSON-LD data. 

#### NTriplesSerializer

N-Triples serializer using the RDF-Ext `Graph.toString()` function.
