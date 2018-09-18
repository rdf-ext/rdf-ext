const DefaultGraph = require('@rdfjs/data-model/lib/default-graph')

class DefaultGraphExt extends DefaultGraph {
  toCanonical () {
    return ''
  }

  toString () {
    return ''
  }

  toJSON () {
    return {
      value: '',
      termType: this.termType
    }
  }
}

module.exports = DefaultGraphExt
