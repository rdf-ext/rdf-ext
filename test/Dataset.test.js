const { deepStrictEqual, rejects, strictEqual } = require('assert')
const getStream = require('get-stream')
const { describe, it } = require('mocha')
const { Readable } = require('readable-stream')
const rdf = require('..')
const Dataset = require('../lib/Dataset')

function simpleFilter (subject, predicate, object, graph) {
  return (quad) => {
    return (!subject || quad.subject.equals(subject)) &&
      (!predicate || quad.predicate.equals(predicate)) &&
      (!object || quad.object.equals(object)) &&
      (!graph || quad.graph.equals(graph))
  }
}

const example = {}
example.subject = rdf.namedNode('http://example.org/subject')
example.subject1 = rdf.namedNode('http://example.org/subject1')
example.subject2 = rdf.namedNode('http://example.org/subject2')
example.subject3 = rdf.namedNode('http://example.org/subject3')
example.predicate = rdf.namedNode('http://example.org/predicate')
example.predicate1 = rdf.namedNode('http://example.org/predicate1')
example.predicate2 = rdf.namedNode('http://example.org/predicate2')
example.predicate3 = rdf.namedNode('http://example.org/predicate3')
example.object = rdf.literal('object')
example.object1 = rdf.literal('1')
example.object2 = rdf.literal('2')
example.object3 = rdf.literal('3')
example.graph = rdf.namedNode('http://example.org/graph')
example.graph1 = rdf.namedNode('http://example.org/graph1')
example.graph2 = rdf.namedNode('http://example.org/graph2')
example.graph3 = rdf.namedNode('http://example.org/graph3')
example.quad = rdf.quad(example.subject, example.predicate, example.object)
example.quad1 = rdf.quad(example.subject, example.predicate, example.object1)
example.quad2 = rdf.quad(example.subject, example.predicate, example.object2)
example.quad3 = rdf.quad(example.subject, example.predicate, example.object3)

describe('Dataset', () => {
  describe('.length', () => {
    it('should be a number property', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.length, 'number')
    })

    it('.length should contain the number of triples in the graph', () => {
      const dataset = new Dataset()

      dataset.add(example.quad)

      strictEqual(dataset.length, 1)
    })
  })

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

      strictEqual(dataset.every(simpleFilter(rdf.namedNode('http://example.org/subject'), null, null)), true)
      strictEqual(dataset.every(simpleFilter(null, null, rdf.literal('a'))), false)
    })
  })

  describe('.filter', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.filter, 'function')
    })

    it('.filter should return a new dataset that contains all quads that pass the filter test', () => {
      const dataset = new Dataset([example.quad1, example.quad2])

      strictEqual(dataset.filter(simpleFilter(example.subject, null, null)).length, 2)
      strictEqual(dataset.filter(simpleFilter(null, null, example.object1)).length, 1)
      strictEqual(dataset.filter(simpleFilter(null, null, example.object3)).length, 0)
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

  describe('.includes', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.includes, 'function')
    })

    it('should test if the dataset contains the given quad', () => {
      const dataset = new Dataset([example.quad1])

      strictEqual(dataset.includes(example.quad1), true)
      strictEqual(dataset.includes(example.quad2), false)
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

  describe('.remove', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.remove, 'function')
    })

    it('should remove the given quad', () => {
      const dataset = new Dataset([example.quad])

      dataset.remove(example.quad)

      strictEqual(dataset.size, 0)
    })
  })

  describe('.removeMatches', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.removeMatches, 'function')
    })

    it('should remove all quads that pass the subject match pattern and return the dataset itself', () => {
      const quad1 = rdf.quad(example.subject1, example.predicate, example.object, example.graph)
      const quad2 = rdf.quad(example.subject2, example.predicate, example.object, example.graph)
      const dataset = new Dataset([quad1, quad2])

      strictEqual(dataset.removeMatches(example.subject3, null, null, null).size, 2)
      strictEqual(dataset.removeMatches(example.subject2, null, null, null).size, 1)
      strictEqual(dataset.removeMatches(example.subject1, null, null, null).size, 0)
    })

    it('should remove all quads that pass the predicate match pattern and return the dataset itself', () => {
      const quad1 = rdf.quad(example.subject, example.predicate1, example.object, example.graph)
      const quad2 = rdf.quad(example.subject, example.predicate2, example.object, example.graph)
      const dataset = new Dataset([quad1, quad2])

      strictEqual(dataset.removeMatches(null, example.predicate3, null, null).size, 2)
      strictEqual(dataset.removeMatches(null, example.predicate2, null, null).size, 1)
      strictEqual(dataset.removeMatches(null, example.predicate1, null, null).size, 0)
    })

    it('should remove all quads that pass the object match pattern and return the dataset itself', () => {
      const quad1 = rdf.quad(example.subject, example.predicate, example.object1, example.graph)
      const quad2 = rdf.quad(example.subject, example.predicate, example.object2, example.graph)
      const dataset = new Dataset([quad1, quad2])

      strictEqual(dataset.removeMatches(null, null, example.object3, null).size, 2)
      strictEqual(dataset.removeMatches(null, null, example.object2, null).size, 1)
      strictEqual(dataset.removeMatches(null, null, example.object1, null).size, 0)
    })

    it('should remove all quads that pass the graph match pattern and return the dataset itself', () => {
      const quad1 = rdf.quad(example.subject, example.predicate, example.object, example.graph1)
      const quad2 = rdf.quad(example.subject, example.predicate, example.object, example.graph2)
      const dataset = new Dataset([quad1, quad2])

      strictEqual(dataset.removeMatches(null, null, null, example.graph3).size, 2)
      strictEqual(dataset.removeMatches(null, null, null, example.graph2).size, 1)
      strictEqual(dataset.removeMatches(null, null, null, example.graph1).size, 0)
    })
  })

  describe('.some', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.some, 'function')
    })

    it('should return true if any quad passes the filter test', () => {
      const dataset = new Dataset([example.quad1, example.quad2])

      strictEqual(dataset.some(simpleFilter(null, null, example.object2)), true)
      strictEqual(dataset.some(simpleFilter(null, null, example.object3)), false)
    })
  })

  describe('.toArray', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.toArray, 'function')
    })

    it('should return all quads in an array', () => {
      const dataset = new Dataset([example.quad1, example.quad2])
      const array = dataset.toArray()

      strictEqual(example.quad1.equals(array[0]), true)
      strictEqual(example.quad2.equals(array[1]), true)
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

      const output = await getStream.array(stream)

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
      const quadNt = '<http://example.org/subject> <http://example.org/predicate> _:c14n0 .\n'

      const dataset = rdf.dataset([quad])

      strictEqual(dataset.toCanonical(), quadNt, true)
    })
  })

  describe('.toString', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.toString, 'function')
    })

    it('should return N-Quads', () => {
      const quad = rdf.quad(example.subject, example.predicate, example.object, example.graph)
      const quadNt = '<http://example.org/subject> <http://example.org/predicate> "object" <http://example.org/graph> .\n'

      const dataset = rdf.dataset([quad])

      strictEqual(dataset.toString(), quadNt)
    })
  })

  describe('.toJSON', () => {
    it('should be a method', () => {
      const dataset = new Dataset()

      strictEqual(typeof dataset.toJSON, 'function')
    })

    it('should return the JSON', () => {
      const quad = rdf.quad(example.subject, example.predicate, example.object, example.graph)
      const quadJson = {
        subject: { value: example.subject.value, termType: 'NamedNode' },
        predicate: { value: example.predicate.value, termType: 'NamedNode' },
        object: {
          value: 'object',
          termType: 'Literal',
          language: '',
          datatype: {
            value: 'http://www.w3.org/2001/XMLSchema#string', termType: 'NamedNode'
          }
        },
        graph: { value: example.graph.value, termType: 'NamedNode' }
      }

      const dataset = rdf.dataset([quad])

      deepStrictEqual(dataset.toJSON(), [quadJson])
    })
  })
})
