const DefaultGraph = require('rdf-data-model/lib/default-graph')

class DefaultGraphExt extends DefaultGraph {
  toCanonical () {
    return ''
  }

  toString () {
    return ''
  }
}

module.exports = DefaultGraphExt
