const Dataset = require('rdf-dataset-simple')

class DatasetExt extends Dataset {
  constructor (quads) {
    super(quads, DatasetExt.factory)
  }

  toString () {
    return this.toCanonical()
  }
}

module.exports = DatasetExt
