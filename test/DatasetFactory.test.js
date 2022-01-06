import { strictEqual } from 'assert'
import standard from '@rdfjs/dataset/test/index.js'
import mocha from 'mocha'
import rdf from '../index.js'
import DatasetExt from '../lib/Dataset.js'
import example from './support/exampleData.js'

const { describe, it } = mocha

describe('DatasetFactory', () => {
  describe('test suite', () => {
    standard({ factory: rdf, mocha })
  })

  describe('.dataset', () => {
    it('should be a function', () => {
      strictEqual(typeof rdf.dataset, 'function')
    })

    it('should return a DatasetExt instance', () => {
      strictEqual(rdf.dataset() instanceof DatasetExt, true)
    })

    it('should always return a DatasetExt instance', () => {
      strictEqual(rdf.dataset().clone() instanceof DatasetExt, true)
      strictEqual(rdf.dataset().merge(rdf.dataset()) instanceof DatasetExt, true)
      strictEqual(rdf.dataset().filter(() => true) instanceof DatasetExt, true)
    })

    it('should initialize the Dataset with the given quads', () => {
      const dataset = rdf.dataset([example.quad1, example.quad2])

      strictEqual(dataset.size, 2)
      strictEqual(dataset.match(null, null, example.object1).size, 1)
      strictEqual(dataset.match(null, null, example.object2).size, 1)
      strictEqual(dataset.match(null, null, null, example.graph).size, 2)
    })

    it('should replace the graph part of the quad if a second parameter is given', () => {
      const dataset = rdf.dataset([example.quad], example.graph1)

      strictEqual(dataset.size, 1)
      strictEqual([...dataset][0].graph.value, example.graph1.value)
    })
  })
})
