import toNT from '@rdfjs/to-ntriples'

class Variable {
  constructor (name) {
    this.value = name
  }

  equals (other) {
    return !!other && other.termType === this.termType && other.value === this.value
  }

  toCanonical () {
    return toNT(this)
  }

  toString () {
    return this.toCanonical()
  }
}

Variable.prototype.termType = 'Variable'

export default Variable
