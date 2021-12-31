import VariableBase from '@rdfjs/data-model/lib/Variable.js'
import toNT from '@rdfjs/to-ntriples'

class Variable extends VariableBase {
  toCanonical () {
    return toNT(this)
  }

  toString () {
    return this.toCanonical()
  }
}

export default Variable
