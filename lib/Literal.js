const termToNTriples = require('@rdfjs/to-ntriples').termToNTriples
const Literal = require('@rdfjs/data-model/lib/literal')

class LiteralExt extends Literal {
  toCanonical () {
    return termToNTriples(this)
  }

  toString () {
    return this.value
  }

  toJSON () {
    return {
      value: this.value,
      termType: this.termType,
      language: this.language,
      datatype: { value: this.datatype.value, termType: this.datatype.termType }
    }
  }
}

module.exports = LiteralExt
