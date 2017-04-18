const normalize = require('rdf-normalize')
const Dataset = require('rdf-dataset-simple')

class DatasetExt extends Dataset {
  constructor (quads) {
    super(quads, DatasetExt.factory)
  }

  equals (other) {
    return this.toCanonical() === other.toCanonical()
  }

  toCanonical () {
    return normalize(this)
  }

  toString () {
    return this._quads.map((quad) => {
      return quad.toString() + '\n'
    }).join('')
  }
}

module.exports = DatasetExt
