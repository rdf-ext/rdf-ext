#!/usr/bin/env node

'use strict';


global.Promise = require('es6-promise').Promise;


var
  fs = require('fs'),
  rdf = require('rdf-interfaces'),
  url = require('url');

require('../rdf-ext')(rdf);


var parserClasses = {
  'jsonld': rdf.JsonLdParser,
  'ntriples': rdf.TurtleParser,
  'rdfxml': rdf.RdfXmlParser,
  'turtle': rdf.TurtleParser
};


var serializerClasses = {
  'jsonld': rdf.JsonLdSerializer,
  'ntriples': rdf.NTriplesSerializer,
  'turtle': rdf.TurtleSerializer
};


var readFsGraph = function (filename, parser) {
  return function () {
    var
      content;

    content = fs.readFileSync(filename).toString();

    return parser.parse(content);
  };
};


var writeFsGraph = function (filename) {
  return function (graph) {
    return outputSerializer.serialize(graph)
      .then(function (content) {
        if (typeof content === 'object') {
          console.log('convert serialized output using JSON.stringify()');

          content = JSON.stringify(content);
        }

        fs.writeFileSync(filename, content);
      });
  }
};


var createParser = function (format, options) {
  return new rdf.promise.Parser(new parserClasses[format](options));
};


var createSerializer = function (format, options) {
  return new rdf.promise.Serializer(new serializerClasses[format](options));
};


var usage = function () {
  process.stderr.write('usage: rdf-ext\n');
  process.stderr.write('\t--input=FILE_OR_URL\t\n');
  process.stderr.write('\t--input-format=FORMAT\t[' + Object.keys(parserClasses).join(',') + ']\n');
  process.stderr.write('\t--output=FILE\n');
  process.stderr.write('\t--output-format=FORMAT\t[' + Object.keys(serializerClasses).join(',') + ']\n');
};


if (process.argv.length == 2) {
  usage();

  return;
}


// variables from command line
var
  input,
  inputFormat = 'turtle',
  output,
  outputFormat = 'turtle';


// parse parameters
process.argv.slice(2).forEach(function(arg) {
  var
    flag = arg.split('=')[0],
    value = arg.split('=')[1];

  switch(flag) {
    case '--input':
      input = value;
      break;

    case '--input-format':
      inputFormat = value.toLowerCase();
      break;

    case '--output':
      output = value;
      break;

    case '--output-format':
      outputFormat = value.toLowerCase();
      break;
  }
});


// validate parameters
if (!(inputFormat in parserClasses)) {
  process.stderr.write('unknown input format: ' + inputFormat);
  process.exit();
}

if (!(outputFormat in serializerClasses)) {
  process.stderr.write('unknown output format: ' + outputFormat);
  process.exit();
}


// create process chain
var
  inputFilename,
  inputParser,
  inputPromise,
  inputStore,
  inputUrl,
  outputPromise,
  outputSerializer;


inputParser = createParser(inputFormat);
inputStore = new rdf.promise.Store(new rdf.LdpStore());
outputSerializer = createSerializer(outputFormat);
inputUrl = url.parse(input);


if (inputUrl.protocol == null || inputUrl.protocol === 'file:') {
  inputFilename = inputUrl.host == null ? inputUrl.path : '/' + inputUrl.host + inputUrl.path;

  console.log('read content from file: ' + inputFilename);
  console.log('use ' + inputFormat + ' to parse input');

  inputPromise = readFsGraph(inputFilename, inputParser);
} else {
  console.log('read graph from url: ' + input);

  inputPromise = function () {
    return inputStore.graph(input);
  }
}


console.log('use ' + outputFormat + ' to serialize output');
console.log('write content to file: ' + output);

outputPromise = writeFsGraph(output);


// run process chain
Promise.resolve()
  .then(function () { return inputPromise(); })
  .then(function (graph) { return outputPromise(graph); })
  .catch(function (error) {
    console.error(error.stack);
  });