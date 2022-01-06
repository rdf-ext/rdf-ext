import LiteralBase from '@rdfjs/data-model/lib/Literal.js'
import toNT from '@rdfjs/to-ntriples'

class Literal extends LiteralBase {
  toCanonical () {
    return toNT(this)
  }

  toString () {
    return this.value
  }
}

export default Literal
