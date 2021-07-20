import toNT from '@rdfjs/to-ntriples'

class DefaultGraph {
  equals (other) {
    return !!other && other.termType === this.termType
  }

  toCanonical () {
    return toNT(this)
  }

  toString () {
    return this.toCanonical()
  }
}

DefaultGraph.prototype.termType = 'DefaultGraph'
DefaultGraph.prototype.value = ''

export default DefaultGraph
