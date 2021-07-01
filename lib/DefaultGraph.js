const termToNTriples = require('@rdfjs/to-ntriples').termToNTriples
const DefaultGraph = require('@rdfjs/data-model/lib/DefaultGraph.js')

class DefaultGraphExt extends DefaultGraph {
  toCanonical () {
    return termToNTriples(this)
  }

  toString () {
    return this.toCanonical()
  }

  toJSON () {
    return {
      value: '',
      termType: this.termType
    }
  }
}

module.exports = DefaultGraphExt
