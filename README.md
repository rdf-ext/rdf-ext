# RDF Interfaces Extension

**Attention: a lot of work has gone through rdf-ext 0.3.0 and it doesn't match this documentation. Right now you can have a look at the tests and at the different packages under the [rdf-ext](https://github.com/rdf-ext) organization. Documentation will be updated soon**

[![Build Status](https://travis-ci.org/rdf-ext/rdf-ext.svg?branch=master)](https://travis-ci.org/zazukoians/rdf-ext)
[![NPM Version](https://img.shields.io/npm/v/rdf-ext.svg?style=flat)](https://npm.im/rdf-ext)


RDF-Ext provides a JavaScript library for working with RDF & Linked Data.
This module contains the core classes to handle RDF Model data.
Additional modules may be required to handle data in different formats (Turtle, JSON-LD, RDF/XML) or stores (LDP, SPARQL).
The [module section](#modules) lists the most common modules.


## Usage

In general, consult the [API documentation](https://github.com/rdf-ext/rdf-ext-spec/blob/gh-pages/API.md) for details about how to interact with the library.


### node.js

RDF-Ext is available on `npm`, to install it run:

	npm install rdf-ext

In the code, import RDF-Ext:

	var rdf = require('rdf-ext');


### Browser

Just import the RDF-Ext distribution:

	<script src="/js/rdf-ext.js"></script>


#### Distribution

You can download a prebuilt or custom distribution from the [RDF-Ext distribution builder site](http://rdf-ext.bergnet.org/).
The [RDF-Ext distribution builder](https://github.com/rdf-ext/rdf-ext-dist-builder) also offers a command line interface to build custom distributions.


#### Browserify

If you build your application with Browserify, RDF-Ext can be bundled flawless.


## Support

Issues & feature requests should be reported on Github.

Pull requests are very welcome.


## Modules

There are many modules for parsing, serializing, stores for persistence and simplified data handling.


### Parsers

* [Abstract](https://github.com/rdf-ext/rdf-parser-abstract) - Can be used to implement own parsers
* [DOM](https://github.com/rdf-ext/rdf-parser-dom) - Can be used to implement parsers for XML or HTML formats
* [JSON-LD](https://github.com/rdf-ext/rdf-parser-jsonld) - Uses the reference implementation to supports all document forms
* [Microdata](https://github.com/rdf-ext/rdf-parser-microdata) - Fork of the [Green Turtle](https://github.com/alexmilowski/green-turtle) parser
* [RDF/XML](https://github.com/rdf-ext/rdf-parser-rdfxml) - Fork of the [rdflib.js](https://github.com/linkeddata/rdflib.js/) RDF/XML parser
* [Turtle & N-Triples](https://github.com/rdf-ext/rdf-parser-n3) - Uses [N3.js](https://github.com/RubenVerborgh/N3.js) for parsing


### Serializers

* [Abstract](https:https://github.com/rdf-ext/rdf-ext-spec/blob/gh-pages/API.md//github.com/rdf-ext/rdf-serializer-abstract) - Can be used to implement own serializers 
* [JSON-LD](https://github.com/rdf-ext/rdf-serializer-jsonld) - Outputs JSON-LD in flat document form
* [N-Triples](https://github.com/rdf-ext/rdf-serializer-ntriples) - Uses the `.toNT()` method to serialize N-Triples
* [Turtle](https://github.com/rdf-ext/rdf-serializer-ntriples) - Uses [N3.js](https://github.com/RubenVerborgh/N3.js) for serializing
* [SPARQL Update](https://github.com/rdf-ext/rdf-serializer-sparql-update) - Generates `INSERT DATA` SPARQL updates 


### Stores

- [Abstract](http://github.com/rdf-ext/rdf-store-abstract) - Abstract implementation, can be used to build your own store
- [ACL wrapper](http://github.com/nicola/rdf-store-acl) - Add ACL support to your RDF store
- [File system](http://github.com/rdf-ext/rdf-store-fs) - Using the file system
- [In Memory](http://github.com/rdf-ext/rdf-store-inmemory) - Store loaded in memomory
- [LDP](http://github.com/rdf-ext/rdf-store-ldp) - Query an external Linked Data Platform via RESTful HTTP requests
- [Local/Remote](http://github.com/nicola/rdf-store-server) - Uses a local store or a remote store depending on the IRI
- [Multistore](http://github.com/nicola/rdf-store-multi) - Use multiple store depending on the IRI
- [Single graph (memory)](http://github.com/rdf-ext/rdf-store-singlegraph) - Store has only a single graph
- [SPARQL](http://github.com/rdf-ext/rdf-store-sparql) - Uses the Graph Store HTTP Protocol interface


### Others

- [Clownface](https://github.com/rdf-ext/clownface) - Simple but powerful graph traversing library
- [Common Formats](https://github.com/rdf-ext/rdf-formats-common) - Loads parsers and serializers for the most common formats
- [SimpleRDF](https://github.com/nicola/simplerdf/) - Simple but powerful graph to object mapping
