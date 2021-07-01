const termToNTriples = require('@rdfjs/to-ntriples').termToNTriples
const Variable = require('@rdfjs/data-model/lib/Variable.js')

class VariableExt extends Variable {
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

module.exports = VariableExt
