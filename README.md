# RDF Interfaces Extension

**Attention: a lot of work has gone through rdf-ext 0.3.0 and it doesn't match this documentation, please come back for a better spec. Right now you can have a look at the tests and different packages under the [rdf-ext](https://github.com/rdf-ext) organization. Documentation will be updated soon**

[![Build Status](https://travis-ci.org/rdf-ext/rdf-ext.svg?branch=master)](https://travis-ci.org/zazukoians/rdf-ext)
[![NPM Version](https://img.shields.io/npm/v/rdf-ext.svg?style=flat)](https://npm.im/rdf-ext)


> RDF-Ext provides a JavaScript library for working with RDF & Linked Data. 


### Parsing
* [Abstract](https://github.com/rdf-ext/rdf-parser-abstract)
* [JSON-LD](https://github.com/rdf-ext/rdf-parser-jsonld)
* [Turtle](https://github.com/rdf-ext/rdf-parser-n3)
* [N-Triples](https://github.com/rdf-ext/rdf-parser-n3)
* [DOM/RDFa](https://github.com/rdf-ext/rdf-parser-dom)
* [RDF/XML](https://github.com/rdf-ext/rdf-parser-rdfxml)
* [Microdata](https://github.com/rdf-ext/rdf-parser-microdata)

### Serializing
* [Abstract](https://github.com/rdf-ext/rdf-serializer-abstract)
* [JSON-LD](https://github.com/rdf-ext/rdf-serializer-jsonld)
* [Turtle](https://github.com/rdf-ext/rdf-serializer-ntriples)
* [Microdata](https://github.com/rdf-ext/rdf-serializer-sparql-update)

### Stores

For persistence, RDF-Ext provides several store implementations. 

- [**Abstract**](http://github.com/rdf-ext/rdf-store-abstract) - Abstract implementation, can be used to build your own store
- [**LDP**](http://github.com/rdf-ext/rdf-store-ldp) - Query an external Linked Data Platform via RESTful HTTP requests
- [**File system**](http://github.com/rdf-ext/rdf-store-fs) - Using the file system
- [**In Memory**](http://github.com/rdf-ext/rdf-store-inmemory) - Store loaded in memomory
- [**Single graph (memory)**](http://github.com/rdf-ext/rdf-store-singlegraph) - Store has only a single graph
- [**SPARQL**](http://github.com/rdf-ext/rdf-store-sparql) - Uses the Graph Store HTTP Protocol interface
- [**RDFStore wrapper**](http://github.com/rdf-ext/rdf-store-rdfstore-js) - Store built on top of [Rdfstore-js](http://github.com/antoniogarrote/rdfstore-js)
- [**Multistore**](http://github.com/nicola/rdf-store-multi) - Use multiple store depending on the IRI
- [**Local/Remote**](http://github.com/nicola/rdf-store-server) - Uses a local store or a remote store depending on the IRI
- [**ACL wrapper**](http://github.com/nicola/rdf-store-acl) - Add ACL support to your RDF store


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

	var rdf = require('rdf-ext');

### Browser

Just import RDF-Ext:

	<script src="/js/rdf-ext.js"></script>

If you want to use rdfstore-js it must be imported first.
Because rdfstore-js comes with an outdated version of JSON-LD it must be deleted afterwards:

	<script src="/js/rdfstore.js"></script>
	<script>delete jsonld;</script>

## Support

Issues & feature requests should be reported on Github.

Pull requests are very welcome.


