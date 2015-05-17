'use strict';


var init = function (rdf) {
  var cf = {};

  cf.options = {
    convertStringUrls: true
  };

  cf.urlRegEx = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

  var node = function (value) {
    if (Array.isArray(value)) {
      return value.map(function (item) {
        return node(item);
      });
    }

    if (typeof value === 'object' && 'interfaceName' in value) {
      return value;
    }

    if (typeof value === 'string') {
      if (cf.options.convertStringUrls && cf.urlRegEx.test(value)) {
        return rdf.createNamedNode(value);
      } else {
        return rdf.createLiteral(value);
      }
    } else if (typeof value === 'number') {
      return rdf.createLiteral(value + '');
    } else {
      throw 'unknown type';
    }
  };

  var inArray = function (node, array) {
    return array.some(function (otherNode) {
      return otherNode.equals(node);
    });
  };

  var toArray = function (value) {
    if (!Array.isArray(value)) {
      return [value];
    }

    return value;
  };

  cf.Graph = function (graph, nodes) {
    if (!(this instanceof cf.Graph)) {
      return new cf.Graph(graph, nodes);
    }

    var self = this;

    var match = function (subject, predicate, object, property) {
      var matches = [];

      graph.forEach(function (triple) {
        if (subject !== null && !inArray(triple.subject, subject)) {
          return;
        }

        if (predicate !== null && !inArray(triple.predicate, predicate)) {
          return;
        }

        if (object !== null && !inArray(triple.object, object)) {
          return;
        }

        matches.push(triple[property]);
      });

      return matches;
    };

    this.graph = function () {
      return graph;
    };

    this.node = function (value) {
      return new cf.Graph(graph, node(toArray(value)));
    };

    this.in = function (predicate) {
      return new cf.Graph(graph, match(null, node(toArray(predicate)), nodes, 'subject'));
    };

    this.out = function (predicate) {
      return new cf.Graph(graph, match(nodes, node(toArray(predicate)), null, 'object'));
    };

    this.nodes = function () {
      return nodes;
    };

    this.literal = function () {
      if (nodes == null) {
        return null;
      }

      return nodes
        .map(function (node) {
          return node.toString();
        });
    };

    this.toArray = function () {
      if (!nodes) {
        return [];
      }

      return nodes.map(this.node);
    };

    this.forEach = function (callback) {
      return this.toArray().forEach(callback);
    };

    this.map = function (callback) {
      return this.toArray().map(callback);
    };

    this.toString = function () {
      return this.literal().join();
    };
  };

  rdf.cf = cf;
};


module.exports = init;
