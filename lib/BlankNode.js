import toNT from '@rdfjs/to-ntriples'

class BlankNode {
  constructor (id) {
    this.value = id
  }

  equals (other) {
    return !!other && other.termType === this.termType && other.value === this.value
  }

  toCanonical () {
    return toNT(this)
  }

  toString () {
    return this.toCanonical()
  }
}

BlankNode.prototype.termType = 'BlankNode'

export default BlankNode
