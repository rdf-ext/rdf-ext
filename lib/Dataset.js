const normalize = require('rdf-normalize')
const quadToNTriples = require('@rdfjs/to-ntriples').quadToNTriples
const Dataset = require('rdf-dataset-indexed/dataset')
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
    return this.toArray().map(quad => `${quadToNTriples(quad)}\n`).join('')
  }

  toJSON () {
    return this.toArray().map(quad => Quad.prototype.toJSON.call(quad))
  }
}

module.exports = DatasetExt
