const termToNTriples = require('@rdfjs/to-ntriples').termToNTriples
const BlankNode = require('@rdfjs/data-model/lib/blank-node')

class BlankNodeExt extends BlankNode {
  toCanonical () {
    return termToNTriples(this)
  }

  toString () {
    return this.toCanonical()
  }

  toJSON () {
    return {
      value: this.value,
      termType: this.termType
    }
  }
}

module.exports = BlankNodeExt
