import DefaultGraphBase from '@rdfjs/data-model/lib/DefaultGraph.js'
import toNT from '@rdfjs/to-ntriples'

class DefaultGraph extends DefaultGraphBase {
  toCanonical () {
    return toNT(this)
  }

  toString () {
    return this.toCanonical()
  }
}

export default DefaultGraph
