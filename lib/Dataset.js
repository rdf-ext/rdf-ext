const normalize = require('rdf-normalize')
const Dataset = require('rdf-dataset-simple')
const Quad = require('./Quad')

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
      return Quad.prototype.toString.call(quad) + '\n'
    }).join('')
  }

  toJSON () {
    return this._quads.map((quad) => { return quad.toJSON() })
  }
}

module.exports = DatasetExt
