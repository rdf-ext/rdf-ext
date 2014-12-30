'use strict';

var fs = require('fs');

var files = [
  '/rdf-ext.js',
  '/lib/inmemory-store.js',
  '/lib/jsonld-parser.js',
  '/lib/jsonld-serializer.js',
  '/lib/ldp-store.js',
  //'/lib/microdata-parser.js',
  //'/lib/uri-resolver.js',
  '/lib/ntriples-serializer.js',
  '/lib/promise.js',
  '/lib/rdfstore-store.js',
  '/lib/rdfxml-parser.js',
  '/lib/singlegraph-store.js',
  '/lib/sparql-store.js',
  '/lib/turtle-parser.js',
  '/lib/turtle-serializer.js'
];


try {
	fs.mkdirSync(__dirname + '/dist');
} catch (e) {}

var script = '';

for (var i = 0; i < files.length; i++) {
  script += fs.readFileSync(__dirname + files[i]).toString() + '\n';
}

fs.writeFileSync(__dirname + '/dist/rdf-ext.js', script);