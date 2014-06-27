var config = {};

// RDF Interfaces implementation

// Core RDF Interfaces https://github.com/webr3/rdf-interfaces
config.rdf = require('rdf-interfaces');

// RDF Interfaces for node.js https://github.com/Acubed/node-rdf
//config.rdf = require('rdf').environment;

// Standalone RDF Interfaces from rdfstore https://github.com/antoniogarrote/rdfstore-js
//config.rdf = new (require('rdf_js_interface')).RDFEnvironment();

// rdfstore https://github.com/antoniogarrote/rdfstore-js
//config.rdf = require('rdfstore').Store.prototype.rdf;

// mixin extended RDF Interface APIs
require('../../rdf-ext.js')(config.rdf);

// mixin extended RDF Interface APIs + fix for merge function
//require('../../rdf-ext')(config.rdf, {replaceMerge:true});

// Store

// built-in in memory store
config.store = new config.rdf.InMemoryStore();

// rdfstore
//config.store = new config.rdf.RdfstoreStore(new rdfstore.Store());

module.exports = config;
