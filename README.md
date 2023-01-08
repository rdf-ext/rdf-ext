# rdf-ext

[![build status](https://img.shields.io/github/actions/workflow/status/rdf-ext/rdf-ext/test.yaml?branch=dep)](https://github.com/rdf-ext/rdf-ext/actions/workflows/test.yaml)
[![npm version](https://img.shields.io/npm/v/rdf-ext.svg)](https://www.npmjs.com/package/rdf-ext)

RDF-Ext is a JavaScript library that extends the [RDF/JS](#rdf-js) specs to handle RDF data in a developer-friendly way.

## Install

```bash
npm install --save rdf-ext
```

## Usage

Just import the default export from the package:

```javascript
import rdf from 'rdf-ext'

const term = rdf.namedNode('http://example.org/')
```

The exported object is an instance of [@rdfjs/environment](https://github.com/rdfjs-base/environment).
The following factories are included in the environment:

- [DataFactory](https://github.com/rdfjs-base/data-model)
- [DatasetFactory](https://github.com/rdfjs-base/dataset)
- [FetchFactory](https://github.com/rdfjs-base/fetch-lite)
- [FormatsFactory](https://github.com/rdfjs-base/formats-common)
- [NamespaceFactory](https://github.com/rdfjs-base/namespace)
- [PrefixMapFactory](https://github.com/rdfjs-base/prefix-map)
- [TermMapFactory](https://github.com/rdfjs-base/term-map/)
- [TermSetFactory](https://github.com/rdfjs-base/term-set)
- [TraverserFactory](https://github.com/rdfjs-base/traverser)

### Experimental features

The package contains experimental features which may break or be removed without being covered in the semantic versioning:

- [ClownfaceFactory](https://github.com/rdf-ext/rdf-ext/blob/master/ClownfaceFactory.js)
- [ScoreFactory](https://github.com/rdfjs-base/score/#factory)

## Documentation & examples

For more details, please check [rdf-ext.org](https://rdf-ext.org/)
