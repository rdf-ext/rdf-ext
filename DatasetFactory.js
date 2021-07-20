import Dataset from './lib/Dataset.js'

class DatasetFactory {
  dataset (quads, graph) {
    const dataset = new Dataset()

    if (quads) {
      if (graph) {
        for (const quad of quads) {
          dataset.add(this.quad(quad.subject, quad.predicate, quad.object, graph))
        }
      } else {
        dataset.addAll(quads)
      }
    }

    return dataset
  }
}

DatasetFactory.exports = ['dataset']

export default DatasetFactory
