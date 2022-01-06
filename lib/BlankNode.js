import BlankNodeBase from '@rdfjs/data-model/lib/BlankNode.js'
import toNT from '@rdfjs/to-ntriples'

class BlankNode extends BlankNodeBase {
  toCanonical () {
    return toNT(this)
  }

  toString () {
    return this.toCanonical()
  }
}

export default BlankNode
