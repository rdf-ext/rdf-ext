import { deepStrictEqual, rejects, strictEqual } from 'assert'
import { describe, it } from 'mocha'
import { Readable } from 'readable-stream'
import chunks from 'stream-chunks/chunks.js'
import rdf from '../index.js'
import Dataset from '../lib/Dataset.js'
import example from './support/exampleData.js'
import spogFilter from './support/spogFilter.js'

describe('Dataset', () => {
  describe('.addAll', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.addAll, 'function')
    })

    it('should import all quads from the given iterable', () => {
      const dataset1 = new Dataset([example.quad1])
      const dataset2 = new Dataset([example.quad2])
      const dataset3 = dataset1.addAll(dataset2)

      strictEqual(dataset1.size, 2)
      strictEqual(dataset2.size, 1)
      strictEqual(dataset3.size, 2)
    })
  })

  describe('.clone', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.clone, 'function')
    })

    it('should create a new dataset instance that contains all quads of the original', () => {
      const dataset = new Dataset()

      dataset.add(example.quad)

      const clone = dataset.clone()

      strictEqual(dataset === clone, false)
      strictEqual(clone.has(example.quad), true)
    })
  })

  describe('.difference', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.difference, 'function')
    })

    it('should return a dataset with quads not included in the other dataset', () => {
      const dataset1 = new Dataset([example.quad1, example.quad2])
      const dataset2 = new Dataset([example.quad2, example.quad3])
      const difference = dataset1.difference(dataset2)

      strictEqual(difference.size, 1)
      strictEqual(difference.has(example.quad1), true)
    })
  })

  describe('.every', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.every, 'function')
    })

    it('should return true if every quad pass the filter test', () => {
      const dataset = new Dataset([example.quad1, example.quad2])

      strictEqual(dataset.every(spogFilter(example.subject, null, null)), true)
      strictEqual(dataset.every(spogFilter(null, null, example.object3)), false)
    })
  })

  describe('.filter', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.filter, 'function')
    })

    it('.filter should return a new dataset that contains all quads that pass the filter test', () => {
      const dataset = new Dataset([example.quad1, example.quad2])

      strictEqual(dataset.filter(spogFilter(example.subject, null, null)).size, 2)
      strictEqual(dataset.filter(spogFilter(null, null, example.object1)).size, 1)
      strictEqual(dataset.filter(spogFilter(null, null, example.object3)).size, 0)
    })
  })

  describe('.forEach', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.forEach, 'function')
    })

    it('should call the callback function for every quad', () => {
      const objects = []
      const dataset = new Dataset([example.quad1, example.quad2])

      dataset.forEach(quad => objects.push(quad.object.value))

      deepStrictEqual(objects, ['1', '2'])
    })
  })

  describe('.import', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.import, 'function')
    })

    it('.import should import quads from stream', async () => {
      const stream = Readable.from([example.quad1, example.quad2])
      const dataset = new Dataset()

      await dataset.import(stream)

      strictEqual(dataset.has(example.quad1), true)
      strictEqual(dataset.has(example.quad2), true)
    })

    it('.import should forward stream errors', async () => {
      const stream = new Readable({
        read: () => {
          stream.destroy(new Error('example'))
        }
      })
      const dataset = new Dataset()

      await rejects(async () => {
        await dataset.import(stream)
      })
    })
  })

  describe('.intersection', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.intersection, 'function')
    })

    it('should return a dataset with quads included also in the other dataset', () => {
      const dataset1 = new Dataset([example.quad1, example.quad2])
      const dataset2 = new Dataset([example.quad2, example.quad3])

      const intersection = dataset1.intersection(dataset2)

      strictEqual(intersection.size, 1)
      strictEqual(intersection.has(example.quad2), true)
    })
  })

  describe('.map', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.map, 'function')
    })

    it('should call the callback function for every quad and return a Dataset that contains the new quads', () => {
      const mappedQuad = rdf.quad(example.subject, example.predicate, rdf.literal('11'))
      const dataset = new Dataset([example.quad1])

      const mappedDataset = dataset.map(quad => {
        return rdf.quad(quad.subject, quad.predicate, rdf.literal(quad.object.value + '1'))
      })

      strictEqual(mappedDataset.size, 1)
      strictEqual(mappedDataset.has(mappedQuad), true)
    })
  })

  describe('.merge', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.merge, 'function')
    })

    it('should return a new dataset that contains all quads from the dataset and the given dataset', () => {
      const dataset1 = new Dataset([example.quad1])
      const dataset2 = new Dataset([example.quad2])
      const dataset3 = dataset1.merge(dataset2)

      strictEqual(dataset1.size, 1)
      strictEqual(dataset2.size, 1)
      strictEqual(dataset3.size, 2)
    })
  })

  describe('.deleteMatches', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.deleteMatches, 'function')
    })

    it('should remove all quads that pass the subject match pattern and return the dataset itself', () => {
      const quad1 = rdf.quad(example.subject1, example.predicate, example.object, example.graph)
      const quad2 = rdf.quad(example.subject2, example.predicate, example.object, example.graph)
      const dataset = new Dataset([quad1, quad2])

      strictEqual(dataset.deleteMatches(example.subject3, null, null, null).size, 2)
      strictEqual(dataset.deleteMatches(example.subject2, null, null, null).size, 1)
      strictEqual(dataset.deleteMatches(example.subject1, null, null, null).size, 0)
    })

    it('should remove all quads that pass the predicate match pattern and return the dataset itself', () => {
      const quad1 = rdf.quad(example.subject, example.predicate1, example.object, example.graph)
      const quad2 = rdf.quad(example.subject, example.predicate2, example.object, example.graph)
      const dataset = new Dataset([quad1, quad2])

      strictEqual(dataset.deleteMatches(null, example.predicate3, null, null).size, 2)
      strictEqual(dataset.deleteMatches(null, example.predicate2, null, null).size, 1)
      strictEqual(dataset.deleteMatches(null, example.predicate1, null, null).size, 0)
    })

    it('should remove all quads that pass the object match pattern and return the dataset itself', () => {
      const quad1 = rdf.quad(example.subject, example.predicate, example.object1, example.graph)
      const quad2 = rdf.quad(example.subject, example.predicate, example.object2, example.graph)
      const dataset = new Dataset([quad1, quad2])

      strictEqual(dataset.deleteMatches(null, null, example.object3, null).size, 2)
      strictEqual(dataset.deleteMatches(null, null, example.object2, null).size, 1)
      strictEqual(dataset.deleteMatches(null, null, example.object1, null).size, 0)
    })

    it('should remove all quads that pass the graph match pattern and return the dataset itself', () => {
      const quad1 = rdf.quad(example.subject, example.predicate, example.object, example.graph1)
      const quad2 = rdf.quad(example.subject, example.predicate, example.object, example.graph2)
      const dataset = new Dataset([quad1, quad2])

      strictEqual(dataset.deleteMatches(null, null, null, example.graph3).size, 2)
      strictEqual(dataset.deleteMatches(null, null, null, example.graph2).size, 1)
      strictEqual(dataset.deleteMatches(null, null, null, example.graph1).size, 0)
    })
  })

  describe('.reduce', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.reduce, 'function')
    })

    it('should call the callback function with the result of the previous value as first argument', () => {
      const dataset = new Dataset([example.quad1, example.quad2])

      const result = dataset.reduce((value, quad) => value + quad.object.value, '')

      strictEqual(result, '12')
    })

    it('should call the callback function for every quad with the quad as second argument', () => {
      const objects = []
      const dataset = new Dataset([example.quad1, example.quad2])

      dataset.reduce((accumulator, quad) => objects.push(quad.object.value))

      deepStrictEqual(objects, ['1', '2'])
    })

    it('should call the callback function with the index as third argument', () => {
      const dataset = new Dataset([example.quad1, example.quad2])

      const result = dataset.reduce((value, quad, index) => value + index, '')

      strictEqual(result, '01')
    })

    it('should call the callback function with the dataset as fourth argument', () => {
      const datasets = []
      const dataset = new Dataset([example.quad1, example.quad2])

      dataset.reduce((value, quad, index, dataset) => datasets.push(dataset))

      strictEqual(datasets.length, 2)
      strictEqual(datasets[0], dataset)
      strictEqual(datasets[1], dataset)
    })

    it('should use the initial value', () => {
      const objects = []
      const dataset = new Dataset([example.quad1, example.quad2])

      const result = dataset.reduce((value, quad) => value + objects.push(quad.object.value), '0')

      strictEqual(result, '012')
    })
  })

  describe('.some', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.some, 'function')
    })

    it('should return true if any quad passes the filter test', () => {
      const dataset = new Dataset([example.quad1, example.quad2])

      strictEqual(dataset.some(spogFilter(null, null, example.object2)), true)
      strictEqual(dataset.some(spogFilter(null, null, example.object3)), false)
    })
  })

  describe('.toStream', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.toStream, 'function')
    })

    it('should return a stream which emits all quads of the dataset', async () => {
      const dataset = new Dataset([example.quad1, example.quad2])

      const stream = dataset.toStream()

      const output = await chunks(stream)

      strictEqual(output.length, 2)
      strictEqual(dataset.has(output[0]), true)
      strictEqual(dataset.has(output[1]), true)
      strictEqual(output[0].equals(output[1]), false)
    })
  })

  describe('.equals', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.equals, 'function')
    })

    it('should compare the other graph for equality', () => {
      const quad1a = rdf.quad(example.subject, example.predicate, rdf.blankNode())
      const quad1b = rdf.quad(example.subject, example.predicate, rdf.blankNode())

      const dataset1a = rdf.dataset([quad1a])
      const dataset1b = rdf.dataset([quad1b])
      const dataset2 = rdf.dataset([example.quad2])

      strictEqual(dataset1a.equals(dataset1b), true)
      strictEqual(dataset1a.equals(dataset2), false)
    })
  })

  describe('.toCanonical', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.toCanonical, 'function')
    })

    it('should return the canonical representation', () => {
      const quad = rdf.quad(example.subject, example.predicate, rdf.blankNode())
      const quadNT = `${quad.subject.toCanonical()} ${quad.predicate.toCanonical()} _:c14n0 .\n`

      const dataset = rdf.dataset([quad])

      strictEqual(dataset.toCanonical(), quadNT, true)
    })
  })

  describe('.toString', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.toString, 'function')
    })

    it('should return N-Quads', () => {
      const quad = rdf.quad(example.subject, example.predicate, example.object, example.graph)
      const quadNT = `${quad.toString()}\n`

      const dataset = rdf.dataset([quad])

      strictEqual(dataset.toString(), quadNT)
    })
  })
})
