const Literal = require('rdf-data-model/lib/literal')
const NamedNode = require('./NamedNode')

class LiteralExt extends Literal {
  toCanonical () {
    if (this.datatype.value === 'http://www.w3.org/2001/XMLSchema#string') {
      return '"' + this.value + '"'
    }

    if (this.datatype.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString') {
      return '"' + this.value + '"@' + this.language
    }

    return '"' + this.value + '"^^' + NamedNode.prototype.toCanonical.call(this.datatype)

    // TODO: escape special chars
  }

  toString () {
    return this.value
  }
}

module.exports = LiteralExt
