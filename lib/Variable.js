const Variable = require('rdf-data-model/lib/variable')

class VariableExt extends Variable {
  toCanonical () {
    return '?' + this.value // TODO: escape special chars
  }

  toString () {
    return this.toCanonical()
  }
}

module.exports = VariableExt
