const Quad = require('rdf-data-model/lib/quad')

class QuadExt extends Quad {
  toCanonical () {
    var graphString = this.graph.toCanonical()

    return this.subject.toCanonical() + ' ' +
      this.predicate.toCanonical() + ' ' +
      this.object.toCanonical() +
      (graphString ? (' ' + graphString) : '') + ' .'
  }

  toString () {
    return this.toCanonical()
  }
}

module.exports = QuadExt
