import NamedNodeBase from '@rdfjs/data-model/lib/NamedNode.js'
import toNT from '@rdfjs/to-ntriples'

class NamedNode extends NamedNodeBase {
  toCanonical () {
    return toNT(this)
  }

  toString () {
    return this.value
  }

  toURL () {
    return new URL(this.value)
  }
}

export default NamedNode
