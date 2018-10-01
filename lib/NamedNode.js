const termToNTriples = require('@rdfjs/to-ntriples').termToNTriples
const NamedNode = require('@rdfjs/data-model/lib/named-node')

class NamedNodeExt extends NamedNode {
  toCanonical () {
    return termToNTriples(this)
  }

  toString () {
    return this.value
  }

  toJSON () {
    return {
      value: this.value,
      termType: this.termType
    }
  }
}

module.exports = NamedNodeExt
