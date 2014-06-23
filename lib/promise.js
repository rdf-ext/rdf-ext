/* global rdf:true, Promise:false */
'use strict';

var isNode = (typeof process !== 'undefined' && process.versions && process.versions.node);


var funcTemplate = function (func, PromiseClass) {
  if (typeof PromiseClass === 'undefined') {
    if (isNode) {
      PromiseClass = require('es6-promise').Promise;
    } else {
      PromiseClass = Promise;
    }
  }

  return function () {
    var args = arguments;

    return new PromiseClass(function (resolve, reject) {
      var callback = function (result, error) {
        if (error != null) {
          reject(error);
        } else {
          resolve(result);
        }
      };

      func(args, callback);
    });
  };
};


var ParserPromiseWrapper = function (parser, p) {
  this.process = funcTemplate(function (args, callback) { parser.process(args[0], args[1], args[2], args[3], callback); }, p);
  this.parse = funcTemplate(function (args, callback) { parser.parse(args[0], callback, args[1], args[2], args[3]); }, p);
};


var SerializerPromiseWrapper = function (serializer, p) {
  this.serialize = funcTemplate(function (args, callback) { serializer.serialize(args[0], callback); }, p);
};


var StorePromiseWrapper = function (store, p) {
  this.graph = funcTemplate(function (args, callback) { store.graph(args[0], callback); }, p);
  this.match = funcTemplate(function (args, callback) { store.match(args[0], args[1], args[2], args[3], callback, args[5]); }, p);
  this.add = funcTemplate(function (args, callback) { store.add(args[0], args[1], callback); }, p);
  this.merge = funcTemplate(function (args, callback) { store.merge(args[0], args[1], callback); }, p);
  this.remove = funcTemplate(function (args, callback) { store.remove(args[0], args[1], callback); }, p);
  this.removeMatch = funcTemplate(function (args, callback) { store.removeMatch(args[0], args[1], args[2], args[3], callback); }, p);
  this.delete = funcTemplate(function (args, callback) { store.delete(args[0], callback); }, p);
};


if (isNode) {
  module.exports = function (rdf) {
    if (typeof rdf.promise === 'undefined') {
      rdf.promise = {};
    }

    rdf.promise.Parser = ParserPromiseWrapper;
    rdf.promise.Serializer = SerializerPromiseWrapper;
    rdf.promise.Store = StorePromiseWrapper;
  };
} else {
  if (typeof rdf === 'undefined') {
    rdf = {};
  }

  if (typeof rdf.promise === 'undefined') {
    rdf.promise = {};
  }

  rdf.promise.Parser = ParserPromiseWrapper;
  rdf.promise.Serializer = SerializerPromiseWrapper;
  rdf.promise.Store = StorePromiseWrapper;
}