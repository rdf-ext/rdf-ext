import toNT from '@rdfjs/to-ntriples'

class Quad {
  constructor (subject, predicate, object, graph) {
    this.subject = subject
    this.predicate = predicate
    this.object = object
    this.graph = graph
  }

  equals (other) {
    // `|| !other.termType` is for backwards-compatibility with old factories without RDF* support.
    return !!other &&
      (other.termType === 'Quad' || !other.termType) &&
      other.subject.equals(this.subject) &&
      other.predicate.equals(this.predicate) &&
      other.object.equals(this.object) &&
      other.graph.equals(this.graph)
  }

  toCanonical () {
    return toNT(this)
  }

  toString () {
    return this.toCanonical()
  }
}

Quad.prototype.termType = 'Quad'
Quad.prototype.value = ''

export default Quad
