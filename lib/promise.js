/* global rdf:true, Promise:false */
'use strict';


var funcTemplate = function (func, PromiseClass) {
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


var ParserPromiseWrapper = function (p, parser) {
  this.process = funcTemplate(function (args, callback) { parser.process(args[0], args[1], args[2], args[3], callback); }, p);
  this.parse = funcTemplate(function (args, callback) { parser.parse(args[0], callback, args[1], args[2], args[3]); }, p);
};


var SerializerPromiseWrapper = function (p, serializer) {
  this.serialize = funcTemplate(function (args, callback) { serializer.serialize(args[0], callback); }, p);
};


var StorePromiseWrapper = function (p, store) {
  this.graph = funcTemplate(function (args, callback) { store.graph(args[0], callback); }, p);
  this.match = funcTemplate(function (args, callback) { store.match(args[0], args[1], args[2], args[3], callback, args[5]); }, p);
  this.add = funcTemplate(function (args, callback) { store.add(args[0], args[1], callback); }, p);
  this.merge = funcTemplate(function (args, callback) { store.merge(args[0], args[1], callback); }, p);
  this.remove = funcTemplate(function (args, callback) { store.remove(args[0], args[1], callback); }, p);
  this.removeMatches = funcTemplate(function (args, callback) { store.removeMatches(args[0], args[1], args[2], args[3], callback); }, p);
  this.delete = funcTemplate(function (args, callback) { store.delete(args[0], callback); }, p);
};


module.exports = function (rdf) {
  rdf.promise = {};
  rdf.promise.Parser = ParserPromiseWrapper.bind(null, rdf.Promise);
  rdf.promise.Serializer = SerializerPromiseWrapper.bind(null, rdf.Promise);
  rdf.promise.Store = StorePromiseWrapper.bind(null, rdf.Promise);
};
