const Literal = require('rdf-data-model/lib/literal')

class LiteralExt extends Literal {
  toCanonical () {
    return '"' + this.value + '"'
    // TODO: escape special chars
    // TODO: language + datatype support
  }

  toString () {
    return this.value
  }
}

module.exports = LiteralExt
