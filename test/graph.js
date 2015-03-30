(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.tests = root.tests || {};
    root.tests.graph = factory();
  }
})(this, function () {
  return function (assert, rdf, readFile, utils, ctx) {
    //TODO: rdf.Graph.difference = function (a, b) {
    //TODO: rdf.Graph.intersection = function (a, b) {
    //TODO: rdf.Graph.map = function (graph, callback) {
    //TODO: rdf.Graph.merge = function (a, b) {
    //TODO: rdf.Graph.toString = function (a) {
  };
});