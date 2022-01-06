import QuadBase from '@rdfjs/data-model/lib/Quad.js'
import toNT from '@rdfjs/to-ntriples'

class Quad extends QuadBase {
  toCanonical () {
    return toNT(this)
  }

  toString () {
    return this.toCanonical()
  }
}

export default Quad
