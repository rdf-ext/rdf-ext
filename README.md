# RDF Interfaces Extension

[![Build Status](https://travis-ci.org/rdf-ext/rdf-ext.svg?branch=master)](https://travis-ci.org/rdf-ext/rdf-ext)
[![npm version](https://badge.fury.io/js/rdf-ext.svg)](https://badge.fury.io/js/rdf-ext)

RDF-Ext provides a low-level JavaScript library for working with RDF & Linked Data.
This module contains the core classes to handle RDF Model data.
Additional modules may be required to handle data in different formats (Turtle, JSON-LD) or stores (Web, SPARQL).
The [module section](#modules) lists the most common modules.

By including this package, you will get an implementation of:

* The [RDF/JS Datamodel specification](http://rdf.js.org/data-model-spec/), provided by [@rdfjs/data-model](https://www.npmjs.com/package/@rdfjs/data-model)
* A fast implementation of the [RDF/JS Dataset specification](https://rdf.js.org/dataset-spec/), provided by [rdf-dataset-indexed](https://www.npmjs.com/package/rdf-dataset-indexed)
* A simple [N-Triples Serializer](https://en.wikipedia.org/wiki/N-Triples), provided by [@rdfjs/to-ntriples](https://www.npmjs.com/package/@rdfjs/to-ntriples)
* A [RDF Dataset Normalization](https://json-ld.github.io/normalization/spec/), provided by [rdf-normalize](https://www.npmjs.com/package/rdf-normalize)

This should be all needed for starting to work with RDF in JavaScript.
If you interact with [named nodes](https://rdf.js.org/data-model-spec/#namednode-interface) directly we recommend [namespace](https://github.com/rdfjs-base/namespace), which gives a nice interface for creating named nodes.

If you are looking for a more high-level interaction with RDF in JavaScript you might consider the graph traversal library [clownface](https://github.com/rdf-ext/clownface) and another abstraction on top of clownface called [RDFine](https://github.com/tpluscode/rdfine). RDF-Ext provides the technical foundation and is included in both projects.

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
In general, all modules are available at [npm](https://www.npmjs.com) and you can use the Github repository name to install them.

### Parsers

* [JSON-LD](https://github.com/rdfjs-base/parser-jsonld) - Uses the reference implementation that supports all document forms
* [Turtle & N-Triples](https://github.com/rdfjs-base/parser-n3) - Uses [N3.js](https://github.com/rdfjs/N3.js) for parsing
* [RDF/XML](https://github.com/rdfjs/rdfxml-streaming-parser.js) - A fast, streaming RDF/XML parser that outputs RDFJS-compliant quads.
* [RDFa Streaming Parser](https://github.com/rubensworks/rdfa-streaming-parser.js) - A fast and lightweight streaming RDFa parser for JavaScript
* [CSV on the Web streaming parser](https://github.com/rdf-ext/rdf-parser-csvw) - A CSV on the Web parser with RDFJS Stream interface.
* [XLSX (Excel) parser](https://github.com/rdf-ext/rdf-parser-csvw-xlsx) - A CSV on the Web based XLSX (Excel) parser with RDFJS Stream interface

If you want to get out of the box support for the most common formats, use [Common Formats](https://github.com/rdfjs-base/formats-common).

### Serializers

* [JSON-LD](https://github.com/rdfjs/serializer-jsonld) - Outputs JSON-LD in flat document form
* or [JSON-LD](https://github.com/rdfjs-base/serializer-jsonld-ext) - Outputs JSON-LD with prefix support and more document forms
* [N-Triples](https://github.com/rdf-ext/rdf-serializer-n3) - Outputs N-Triples
* [CSV](https://github.com/rdf-ext/rdf-serializer-csvw) - CSV on the Web serializer that implements the RDFJS Sink interface.

If you want to get out of the box support for the most common formats, use [Common Formats](https://github.com/rdfjs-base/formats-common).

### Stores

Implementations of the RDFJS [Store](http://rdf.js.org/stream-spec/#store-interface) interface.

- [Dataset](http://github.com/rdf-ext/rdf-store-dataset) - Wrapper around an in memory Dataset
- [SPARQL](http://github.com/rdf-ext/rdf-store-sparql) - Uses the SPARQL 1.1 Protocol
- [Filesystem](https://github.com/rdf-ext/rdf-store-fs) - Filesystem based RDF Store that follows the RDF/JS: Stream interfaces specification.
- [Web](http://github.com/rdf-ext/rdf-store-web) - Query an external Linked Data via RESTful HTTP requests

### Others

- [Common Formats](https://github.com/rdfjs-base/formats-common) - Loads parsers and serializers for the most common formats
- [Clownface](https://github.com/rdf-ext/clownface) - A graph traversal library inspired by Gremlin which allows querying any RDF dataset in a concise and readable way.
- [Express-Handler](https://github.com/rdfjs-base/express-handler) - Handle incoming and outgoing RDF data in Express
- [Fetch](https://github.com/rdfjs-base/fetch) - Uses [Fetch](https://developer.mozilla.org/docs/Web/API/Fetch_API) to send and receive RDF-Ext Graphs over HTTP
- [Fetch lite](https://github.com/rdfjs-base/fetch-lite) - Same as above but does not include common parsers and serializers so it is lightweight
- [Namespace](https://github.com/rdfjs-base/namespace) - The package exports a factory to create builders for Named Nodes.
