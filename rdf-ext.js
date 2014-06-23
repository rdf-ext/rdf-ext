/* global rdf:true */
'use strict';

var isNode = (typeof process !== 'undefined' && process.versions && process.versions.node);

var defaultRequest = null;
var corsProxyRequest = null;


if (isNode) {
  var http = require('http');
  var https = require('https');
  var url = require('url');

  defaultRequest = function (method, requestUrl, headers, content, callback) {
    var
      options = url.parse(requestUrl),
      client = http;

    options.hash = null;
    options.method = method;
    options.headers = headers;

    if (options.protocol === 'https:') {
      client = https;
    }

    var req = client.request(options, function (res) {
      var resContent = '';

      res.setEncoding('utf8');
      res.on('data', function (chunk) { resContent += chunk; });
      res.on('end', function () { callback(res.statusCode, res.headers, resContent); });
    });

    req.on('error', function (error) { callback(null, null, null, error); });

    if (content != null) {
      req.write(content);
    }

    req.end();
  };
} else {
  defaultRequest = function (method, requestUrl, headers, content, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === xhr.DONE) {
        var
          headerLines = xhr.getAllResponseHeaders().split('\r\n'),
          resHeaders = {};

        for (var i = 0; i < headerLines.length; i++) {
          var headerLine = headerLines[i].split(': ', 2);
          resHeaders[headerLine[0].toLowerCase()] = headerLine[1];
        }

        callback(xhr.status, resHeaders, xhr.responseText);
      }
    };

    xhr.open(method, requestUrl, true);

    for (var header in headers) {
      xhr.setRequestHeader(header, headers[header]);
    }

    xhr.send(content);
  };

  corsProxyRequest = function (proxyUrl, method, requestUrl, headers, content, callback) {
    var url = proxyUrl + '?url=' + encodeURIComponent(requestUrl);

    defaultRequest(method, url, headers, content, callback);
  };
}


var mixin = function (rdf, options) {
  if (options == null) {
		options = {};
  }

  rdf.ns = {
    type: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
  };

  if (typeof rdf.Graph === 'undefined') {
		rdf.Graph = {};
  }

  rdf.Graph.toString = function (a) {
    var s = '';

    a.forEach(function (t) {
      s += t.toString() + '\n';
    });

    return s;
  };

  rdf.Graph.merge = function (a, b) {
    var m = rdf.createGraph();

    m.addAll(a);
    m.addAll(b);

    return m;
  };

  rdf.Graph.intersection = function (a, b) {
    var i = rdf.createGraph();

    a.forEach(function (at) {
      if (b.some(function (bt) { return at.equals(bt); })) {
        i.add(at);
      }
    });

    return i;
  };

  rdf.Graph.difference = function (a, b) {
    var d = rdf.createGraph();

    a.forEach(function (at) {
      if (!b.some(function (bt) { return at.equals(bt); })) {
        d.add(at);
      }
    });

    return d;
  };

  var wrappedCreateGraph = rdf.createGraph.bind(rdf);

  rdf.createGraphExt = function (triples) {
    var graph = wrappedCreateGraph(triples);

    graph.toString = rdf.Graph.toString.bind(graph, graph);

    graph.intersection = rdf.Graph.intersection.bind(graph, graph);

    graph.difference = rdf.Graph.difference.bind(graph, graph);

    if ('replaceMerge' in options && options.replaceMerge) {
      graph.merge = rdf.Graph.merge.bind(graph, graph);
    }

    return graph;
  };

  Object.defineProperty(rdf, 'createGraph', { value: rdf.createGraphExt });

  rdf.defaultRequest = defaultRequest;
  rdf.corsProxyRequest = corsProxyRequest;
};


if (isNode) {
  module.exports = function (rdf, options) {
    if (options == null) {
      options = {};
    }

    mixin(rdf, options);

    require('./lib/inmemory-store.js')(rdf);
    require('./lib/jsonld-parser.js')(rdf);
    require('./lib/jsonld-serializer.js')(rdf);
    require('./lib/rdfxml-parser.js')(rdf);
    require('./lib/turtle-parser.js')(rdf);
    require('./lib/ntriples-serializer.js')(rdf);
    require('./lib/ldp-store.js')(rdf);
    require('./lib/rdfstore-store.js')(rdf);
    require('./lib/sparql-store.js')(rdf);
    require('./lib/rdfstore-store.js')(rdf);
    require('./lib/promise.js')(rdf);
  };
} else {
  if (typeof rdf === 'undefined') {
    rdf = {};
  }

  mixin(rdf);
}