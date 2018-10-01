const quadToNTriples = require('@rdfjs/to-ntriples').quadToNTriples
const Quad = require('@rdfjs/data-model/lib/quad')

class QuadExt extends Quad {
  toCanonical () {
    return quadToNTriples(this)
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
