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

In the code, import RDF-Ext:

	var rdf = require('rdf-ext')();

### Browser

Just import RDF-Ext:

	<script src="/js/rdf-ext.js"></script>

If you want to use rdfstore-js it must be imported first.
Because rdfstore-js comes with an outdated version of JSON-LD it must be deleted afterwards:

	<script src="/js/rdfstore.js"></script>
	<script>delete jsonld;</script>

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

### RDFJS Primer

See [RDFJS Primer](https://github.com/zazukoians/rdfjs-primer) for more examples. 

## Support

Issues & feature requests should be reported on Github.

Pull requests are very welcome.

## Implementations

### Store

#### InMemoryStore

A simple in-memory triple store implementation.
Cross graph read operations are supported by using `undefined` as graph IRI.
In that case `.graph` returns all graphs merged into a single graph and `.match` operates on that single merged graph.
Because there is nothing to configure, the constructor doesn't require any parameters.

#### LdpStore

Store implementation to access graphs via a RESTful [LDP](http://www.w3.org/TR/ldp/) interface.
The constructor accepts a single `options` parameters.

The `options` object can have the following properties:

* `defaultParser` If the response uses an unknow mime type, that parse is used by default.
  By default 'text/turtle' is used.
* `defaultSerializer` The mime type and serializer used for write requests.
  By default 'text/turtle' is used.
* `parsers` Map that contains mime type to parser function key value pairs.
  By default LdpStore.defaultParsers is used
* `request` Replaces the default request function.
  See the utils sections for implementations provided by RDF-Ext.
* `serializers` Map that contains mime type to serialize function key value pairs.
  By default LdpStore.defaultSerializers is used

#### RdfstoreStore

Store based on [rdfstore-js](https://github.com/antoniogarrote/rdfstore-js).
The constructor requires a rdfstore-js object parameter that will be wrapped.

#### SingleGraphStore

In memory triple store using a single graph for all named graphs.
Sometimes usefull for testing.

#### SparqlStore

Store implementation to access graphs via [SPARQL 1.1 Graph Store HTTP Protocol](http://www.w3.org/TR/sparql11-http-rdf-update/) interface. This requires an external triple store.

The constructor accepts a single `options` parameters.

The `options` object can have the following properties:

* `endpointUrl` The URL of the SPARQL endpoint.
  This is a required property.
* `updateUrl` Use a different URL for write operations.
  By default the `endpointUrl` is used.
* `mimeType` Graph data is read using CONSTRUCT queries.
  This parameter defines the requested mime type.
  The default value is `text/turtle`.
* `serialize` Replaces the serialize function that is used to build the INSERT statements.
  The serialize function must generate valid SPARQL data!
  `rdf.serializeNTriples` is used by default.
* `parse` Replaces the function used to parse the CONSTRUCT query output.
  The parser must be able to parse data in the format defined in the `mimeType` property.
  `rdf.parseTurtle` is used by default.
* `request` Replaces the default request function.
  See the utils sections for implementations provided by RDF-Ext.

### Parser

#### JsonLdParser

Parser for JSON-LD using the standard [JSON-LD library](https://github.com/digitalbazaar/jsonld.js).
The standard library is used for preprocessing.
So any document form (expanded, compacted or flattened) is supported.

#### RdfXmlParser

Parser for RDF/XML data using a fork of the [rdflib.js](https://github.com/linkeddata/rdflib.js) parser.

#### TurtleParser

Turtle parser using [N3.js](https://github.com/RubenVerborgh/N3.js).

The constructor accepts a single `options` parameters.

The `options` object can have the following properties:

* `importPrefixMap` If this property is set to `true`, the prefix map provided by N3.js will be imported into the
  RDF-Interfaces environment.

### Serializer

#### JsonLdSerializer

JSON-LD serializer exports expanded JSON-LD data.

#### NTriplesSerializer

N-Triples serializer using the RDF-Ext `Graph.toString()` function.

### Utils

#### defaultRequest

Uses the standard http/https modules on a Node.js environment.
In the browser the request is performed based on `XMLHttpRequest`.
If you want to implement your own request function you have to use the following function signature:

* `method` HTTP method
* `requestUrl` Requested URL
* `headers` HTTP request headers as key/value object
* `content` Content for POST/PUT requests
* `callback` Callback function
 * `statuseCode` HTTP response status code
 * `headers` HTTP response headers as key/value object
 * `content` HTTP response content
 * `error` Error message or null on success

#### corsProxyRequest

Still many server on the web don't send [CORS](http://www.w3.org/TR/cors/) headers.
Using a proxy is the only workaround to bypass the cross origin policy.
This function supports transparent requests using a proxy.
The proxy URL is the first parameter of the function.

`.bind` must be used to create a function with the default request function signature:

	rdf.corsProxyRequest.bind(rdf, proxyUrl);

Now the request are translation using the following code:

	proxyUrl + '?url=' + encodeURIComponent(requestUrl);
