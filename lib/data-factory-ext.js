'use strict'

const DataFactory = require('rdf-data-model')
const Dataset = require('./simple-dataset')

class DataFactoryExt extends DataFactory {
  static graph (quads) {
    let dataset = new Dataset()

    if (quads) {
      quads.forEach((quad) => {
        dataset.add(DataFactoryExt.quad(quad.subject, quad.predicate, quad.object))
      })
    }

    return dataset
  }

  static dataset (quads) {
    let dataset = new Dataset()

    if (quads) {
      dataset.addAll(quads)
    }

    return dataset
  }
}

module.exports = DataFactoryExt
