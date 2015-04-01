'use strict';

var
  http = require('http'),
  https = require('https'),
  url = require('url');


var utils = {};


utils.defaultRequest = function (method, requestUrl, headers, content, callback) {
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

  if (content) {
    req.write(content);
  }

  req.end();
};

utils.parseHtml = function (toparse, base) {
  var parser = new (require('xmldom').DOMParser)();

  return parser.parseFromString(toparse, 'text/html');
};

utils.parseXml = function (toparse, base) {
  var parser = new (require('xmldom').DOMParser)();

  return parser.parseFromString(toparse, 'application/xml');
};

utils.mixin = function (rdf) {
  rdf.Promise = rdf.Promise || require('es6-promise').Promise;
  rdf.defaultRequest = utils.defaultRequest;
  rdf.parseHtml = utils.parseHtml;
  rdf.parseXml = utils.parseXml;
};


module.exports = utils.mixin;
