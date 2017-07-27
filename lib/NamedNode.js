const NamedNode = require('rdf-data-model/lib/named-node')

class NamedNodeExt extends NamedNode {
  toCanonical () {
    return '<' + this.value + '>' // TODO: escape special chars
  }

  toString () {
    return this.value
  }
}

module.exports = NamedNodeExt
