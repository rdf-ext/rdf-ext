const BlankNode = require('rdf-data-model/lib/blank-node')

class BlankNodeExt extends BlankNode {
  toCanonical () {
    return '_:' + this.value // TODO: escape special chars
  }

  toString () {
    return this.toCanonical()
  }
}

module.exports = BlankNodeExt
