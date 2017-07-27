# RDF Interfaces Extension

[![Build Status](https://travis-ci.org/rdf-ext/rdf-ext.svg?branch=master)](https://travis-ci.org/rdf-ext/rdf-ext)
[![npm version](https://badge.fury.io/js/rdf-ext.svg)](https://badge.fury.io/js/rdf-ext)

RDF-Ext provides a JavaScript library for working with RDF & Linked Data.
This module contains the core classes to handle RDF Model data.
Additional modules may be required to handle data in different formats (Turtle, JSON-LD) or stores (Web, SPARQL).
The [module section](#modules) lists the most common modules.

## Usage

In general, consult the [RDFJS specification](https://github.com/rdfjs/representation-task-force/) for details about how to interact with the library.

### Node

RDF-Ext is available on `npm`, to install it run:

	npm install rdf-ext

In the code, import RDF-Ext:

	const rdf = require('rdf-ext')

### Browser

The preferred way to use RDF-Ext in the browser is using [browserify](http://browserify.org/).

#### Distribution

It's also possible to use a prebuilt or custom distribution using the [RDF-Ext distribution builder](https://github.com/rdf-ext/rdf-ext-dist-builder).
This can be also done using the [RDF-Ext distribution builder site](http://rdf-ext.bergnet.org/).

Than just import the RDF-Ext distribution:

	<script src="/js/rdf-ext.js"></script>
	
Everything is attached to the global variable `rdf`. 

## Support

Issues & feature requests should be reported on Github.

Pull requests are very welcome.

## Modules

There are many modules for parsing, serializing, stores for persistence and simplified data handling.
In general all modules are available at [npm](https://www.npmjs.com) and you can use the Github repository name to install them.

### Parsers

* [JSON-LD](https://github.com/rdf-ext/rdf-parser-jsonld) - Uses the reference implementation to supports all document forms
* [Turtle & N-Triples](https://github.com/rdf-ext/rdf-parser-n3) - Uses [N3.js](https://github.com/RubenVerborgh/N3.js) for parsing

Also see [rdf-formats-common](https://github.com/rdf-ext/rdf-formats-common) if you want to get support for the most common formats.

### Serializers

* [JSON-LD](https://github.com/rdf-ext/rdf-serializer-jsonld) - Outputs JSON-LD in flat document form
* or [JSON-LD](https://github.com/rdf-ext/rdf-serializer-jsonld-ext) - Outputs JSON-LD with prefix support and more document forms
* [N-Triples](https://github.com/rdf-ext/rdf-serializer-ntriples) - Outputs N-Triples

Also see [rdf-formats-common](https://github.com/rdf-ext/rdf-formats-common) if you want to get support for the most common formats.

### Stores

- [Dataset](http://github.com/rdf-ext/rdf-store-dataset) - Wrapper around a in memory Dataset
- [SPARQL](http://github.com/rdf-ext/rdf-store-sparql) - Uses the Graph Store HTTP Protocol interface
- [Web](http://github.com/rdf-ext/rdf-store-web) - Query an external Linked Data via RESTful HTTP requests

### Others

- [Common Formats](https://github.com/rdf-ext/rdf-formats-common) - Loads parsers and serializers for the most common formats
- [SimpleRDF](https://github.com/nicola/simplerdf/) - Simple but powerful graph to object mapping
- [RDF body parser](https://github.com/rdf-ext/rdf-body-parser) - Node body parsing middleware, parses incoming RDF data and sends RDF data
