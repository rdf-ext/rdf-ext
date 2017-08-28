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

  toJSON () {
    return {
      subject: this.subject.toJSON(),
      predicate: this.predicate.toJSON(),
      object: this.object.toJSON(),
      graph: this.graph.toJSON()
    }
  }
}

module.exports = QuadExt
