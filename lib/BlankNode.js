const BlankNode = require('rdf-data-model/lib/blank-node')

class BlankNodeExt extends BlankNode {
  toCanonical () {
    return '_:' + this.value // TODO: escape special chars
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
