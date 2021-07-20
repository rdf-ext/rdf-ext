import toNT from '@rdfjs/to-ntriples'

class NamedNode {
  constructor (iri) {
    this.value = iri
  }

  equals (other) {
    return !!other && other.termType === this.termType && other.value === this.value
  }

  toCanonical () {
    return toNT(this)
  }

  toString () {
    return this.value
  }
}

NamedNode.prototype.termType = 'NamedNode'

export default NamedNode
