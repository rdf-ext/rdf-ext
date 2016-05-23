'use strict'

/* global describe, it */
const assert = require('assert')
const rdf = require('rdf-data-model')
const Dataset = require('../lib/simple-dataset')
const EventEmitter = require('events').EventEmitter

function simpleFilter (subject, predicate, object, graph) {
  return function (quad) {
    return (!subject || quad.subject.equals(subject)) &&
      (!predicate || quad.predicate.equals(predicate)) &&
      (!object || quad.object.equals(object)) &&
      (!graph || quad.graph.equals(graph))
  }
}

describe('SimpleDataset', () => {
  it('should implement the Dataset interface', () => {
    let dataset = new Dataset()

    assert.equal(typeof dataset.length, 'number')
    assert.equal(typeof dataset.add, 'function')
    assert.equal(typeof dataset.addAll, 'function')
    assert.equal(typeof dataset.clone, 'function')
    assert.equal(typeof dataset.difference, 'function')
    assert.equal(typeof dataset.equals, 'function')
    assert.equal(typeof dataset.every, 'function')
    assert.equal(typeof dataset.filter, 'function')
    assert.equal(typeof dataset.forEach, 'function')
    assert.equal(typeof dataset.import, 'function')
    assert.equal(typeof dataset.includes, 'function')
    assert.equal(typeof dataset.intersection, 'function')
    assert.equal(typeof dataset.map, 'function')
    assert.equal(typeof dataset.match, 'function')
    assert.equal(typeof dataset.merge, 'function')
    assert.equal(typeof dataset.remove, 'function')
    assert.equal(typeof dataset.removeMatches, 'function')
    assert.equal(typeof dataset.some, 'function')
    assert.equal(typeof dataset.toArray, 'function')
    assert.equal(typeof dataset.toCanonical, 'function')
    assert.equal(typeof dataset.toStream, 'function')
    assert.equal(typeof dataset.toString, 'function')
  })

  it('.length should contain the number of triples in the graph', () => {
    let quad = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('object'))

    let dataset = new Dataset()

    dataset._quads.push(quad)

    assert.equal(dataset.length, 1)
  })
  
  it('.add should add triples to the graph', () => {
    let quad = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('object'))

    let dataset = new Dataset()

    dataset.add(quad)

    assert.equal(quad.equals((dataset._quads[0])), true)
  })

  it('.add should not create duplicates', () => {
    let quad = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('object'))

    let dataset = new Dataset()

    dataset.add(quad)
    dataset.add(quad)

    assert.equal(dataset._quads.length, 1)
  })

  it('.addAll should import all triples from the given graph', () => {
    let quad1 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('a'))

    let quad2 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('b'))

    let dataset1 = new Dataset([quad1])
    let dataset2 = new Dataset([quad2])
    let dataset3 = dataset1.addAll(dataset2)

    assert.equal(dataset1._quads.length, 2)
    assert.equal(dataset2._quads.length, 1)
    assert.equal(dataset3._quads.length, 2)
  })

  it('.clone should create a new Dataset instance that contains all quads of the original', () => {
    let quad = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('object'))

    let dataset = new Dataset()

    dataset.add(quad)

    let clone = dataset.clone()

    assert.equal(dataset === clone, false)
    assert.equal(dataset._quads[0].equals(clone._quads[0]), true)
  })

  it('.difference should return a dataset with quads not included in the other dataset', () => {
    let quad1 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('a'))

    let quad2 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('b'))

    let quad3 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('c'))

    let dataset1 = new Dataset([quad1, quad2])
    let dataset2 = new Dataset([quad2, quad3])
    let difference = dataset1.difference(dataset2)

    assert.equal(difference._quads.length, 1)
    assert.equal(quad1.equals(difference._quads[0]), true)
  })

  it('.equals should compare the other graph for equality', () => {
    let quad1a = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.blankNode())

    let quad1b = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.blankNode())

    let quad2 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('c'))

    let dataset1a = new Dataset([quad1a])
    let dataset1b = new Dataset([quad1b])
    let dataset2 = new Dataset([quad2])

    assert.equal(dataset1a.equals(dataset1b), true)
    assert.equal(dataset1a.equals(dataset2), false)
  })

  it('.every should return true if every quad pass the filter test', () => {
    let quad1 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('a'))

    let quad2 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('b'))

    let dataset = new Dataset([quad1, quad2])

    assert.equal(dataset.every(simpleFilter(rdf.namedNode('http://example.org/subject'), null, null)), true)
    assert.equal(dataset.every(simpleFilter(null, null, rdf.literal('a'))), false)
  })

  it('.filter should return a new dataset that contains all quads that pass the filter test', () => {
    let quad1 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('a'))

    let quad2 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('b'))

    let dataset = new Dataset([quad1, quad2])

    assert.equal(dataset.filter(simpleFilter(rdf.namedNode('http://example.org/subject'), null, null)).length, 2)
    assert.equal(dataset.filter(simpleFilter(null, null, rdf.literal('a'))).length, 1)
    assert.equal(dataset.filter(simpleFilter(null, null, rdf.literal('c'))).length, 0)
  })

  it('.forEach should call the callback function for every quad', () => {
    let quad1 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('a'))

    let quad2 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('b'))

    let dataset = new Dataset([quad1, quad2])

    let objects = []

    dataset.forEach((quad) => {
      objects.push(quad.object.value)
    })

    assert.equal(objects.length, 2)
    assert.deepEqual(objects, ['a', 'b'])
  })

  it ('.import should import quads from stream', () => {
    let stream = new EventEmitter()
    let dataset = new Dataset()
    let quad1 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('a'))

    let quad2 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('b'))

    let result = dataset.import(stream)

    stream.emit('data', quad1)
    stream.emit('data', quad2)
    stream.emit('end')

    return result.then(() => {
      assert.equal(quad1.equals(dataset._quads[0]), true)
      assert.equal(quad2.equals(dataset._quads[1]), true)
    })
  })

  it ('.import should forward stream errors', () => {
    let stream = new EventEmitter()
    let dataset = new Dataset()

    let result = dataset.import(stream)

    stream.emit('error', new Error('example'))

    return new Promise((resolve, reject) => {
      result.then(() => {
        reject(new Error('no error thrown'))
      }).catch((err) => {
        resolve()
      })
    })
  })

  it('.includes should test if the dataset contains the given quad', () => {
    let quad1 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('a'))

    let quad2 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('b'))

    let dataset = new Dataset([quad1])

    assert.equal(dataset.includes(quad1), true)
    assert.equal(dataset.includes(quad2), false)
  })

  it('.intersection should return a dataset with quads included also in the other dataset', () => {
    let quad1 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('a'))

    let quad2 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('b'))

    let quad3 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('c'))

    let dataset1 = new Dataset([quad1, quad2])
    let dataset2 = new Dataset([quad2, quad3])
    let intersection = dataset1.intersection(dataset2)

    assert.equal(intersection._quads.length, 1)
    assert.equal(quad2.equals(intersection._quads[0]), true)
  })

  it('.map should call the callback function for every quad and return an array that contains the return values', () => {
    let quad1 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('a'))

    let quad2 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('b'))

    let dataset = new Dataset([quad1, quad2])

    let objects = dataset.map((quad) => {
      return quad.object.value
    })

    assert.equal(objects.length, 2)
    assert.deepEqual(objects, ['a', 'b'])
  })

  it('.match should return a new dataset that contains all quads that pass the subject match pattern', () => {
    let subject1 = rdf.namedNode('http://example.org/subject1')
    let subject2 = rdf.namedNode('http://example.org/subject2')
    let predicate = rdf.namedNode('http://example.org/predicate')
    let object = rdf.namedNode('http://example.org/object')
    let graph = rdf.namedNode('http://example.org/graph')
    let quad1 = rdf.quad(subject1, predicate, object, graph)
    let quad2 = rdf.quad(subject2, predicate, object, graph)
    let dataset = new Dataset([quad1, quad2])

    assert.equal(dataset.match(rdf.namedNode('http://example.org/subject1'), null, null, null).length, 1)
    assert.equal(dataset.match(rdf.namedNode('http://example.org/subject2'), null, null, null).length, 1)
    assert.equal(dataset.match(rdf.namedNode('http://example.org/subject3'), null, null, null).length, 0)
  })

  it('.match should return a new dataset that contains all quads that pass the predicate match pattern', () => {
    let subject = rdf.namedNode('http://example.org/subject')
    let predicate1 = rdf.namedNode('http://example.org/predicate1')
    let predicate2 = rdf.namedNode('http://example.org/predicate2')
    let object = rdf.namedNode('http://example.org/object')
    let graph = rdf.namedNode('http://example.org/graph')
    let quad1 = rdf.quad(subject, predicate1, object, graph)
    let quad2 = rdf.quad(subject, predicate2, object, graph)
    let dataset = new Dataset([quad1, quad2])

    assert.equal(dataset.match(null, rdf.namedNode('http://example.org/predicate1'), null, null).length, 1)
    assert.equal(dataset.match(null, rdf.namedNode('http://example.org/predicate2'), null, null).length, 1)
    assert.equal(dataset.match(null, rdf.namedNode('http://example.org/predicate3'), null, null).length, 0)
  })

  it('.match should return a new dataset that contains all quads that pass the object match pattern', () => {
    let subject = rdf.namedNode('http://example.org/subject')
    let predicate = rdf.namedNode('http://example.org/predicate')
    let object1 = rdf.namedNode('http://example.org/object1')
    let object2 = rdf.namedNode('http://example.org/object2')
    let graph = rdf.namedNode('http://example.org/graph')
    let quad1 = rdf.quad(subject, predicate, object1, graph)
    let quad2 = rdf.quad(subject, predicate, object2, graph)
    let dataset = new Dataset([quad1, quad2])

    assert.equal(dataset.match(null, null, rdf.namedNode('http://example.org/object1'), null).length, 1)
    assert.equal(dataset.match(null, null, rdf.namedNode('http://example.org/object2'), null).length, 1)
    assert.equal(dataset.match(null, null, rdf.namedNode('http://example.org/object3'), null).length, 0)
  })

  it('.match should return a new dataset that contains all quads that pass the graph match pattern', () => {
    let subject = rdf.namedNode('http://example.org/subject')
    let predicate = rdf.namedNode('http://example.org/predicate')
    let object = rdf.namedNode('http://example.org/object')
    let graph1 = rdf.namedNode('http://example.org/graph1')
    let graph2 = rdf.namedNode('http://example.org/graph2')
    let quad1 = rdf.quad(subject, predicate, object, graph1)
    let quad2 = rdf.quad(subject, predicate, object, graph2)
    let dataset = new Dataset([quad1, quad2])

    assert.equal(dataset.match(null, null, null, rdf.namedNode('http://example.org/graph1')).length, 1)
    assert.equal(dataset.match(null, null, null, rdf.namedNode('http://example.org/graph2')).length, 1)
    assert.equal(dataset.match(null, null, null, rdf.namedNode('http://example.org/graph3')).length, 0)
  })

  it('.merge should return a new graph that contains all triples from the graph object and the given graph', () => {
    let quad1 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('a'))

    let quad2 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('b'))

    let dataset1 = new Dataset([quad1])
    let dataset2 = new Dataset([quad2])
    let dataset3 = dataset1.merge(dataset2)

    assert.equal(dataset1._quads.length, 1)
    assert.equal(dataset2._quads.length, 1)
    assert.equal(dataset3._quads.length, 2)
  })

  it('.remove should remove the given triple', () => {
    let quad = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('object'))
    let dataset = new Dataset([quad])

    dataset.remove(quad)

    assert.equal(dataset._quads.length, 0)
  })

  it('.removeMatches should remove all quads that pass the subject match pattern and return the dataset itself', () => {
    let subject1 = rdf.namedNode('http://example.org/subject1')
    let subject2 = rdf.namedNode('http://example.org/subject2')
    let predicate = rdf.namedNode('http://example.org/predicate')
    let object = rdf.namedNode('http://example.org/object')
    let graph = rdf.namedNode('http://example.org/graph')
    let quad1 = rdf.quad(subject1, predicate, object, graph)
    let quad2 = rdf.quad(subject2, predicate, object, graph)
    let dataset = new Dataset([quad1, quad2])

    assert.equal(dataset.removeMatches(rdf.namedNode('http://example.org/subject3'), null, null, null).length, 2)
    assert.equal(dataset.removeMatches(rdf.namedNode('http://example.org/subject2'), null, null, null).length, 1)
    assert.equal(dataset.removeMatches(rdf.namedNode('http://example.org/subject1'), null, null, null).length, 0)
  })

  it('.removeMatches should remove all quads that pass the predicate match pattern and return the dataset itself', () => {
    let subject = rdf.namedNode('http://example.org/subject')
    let predicate1 = rdf.namedNode('http://example.org/predicate1')
    let predicate2 = rdf.namedNode('http://example.org/predicate2')
    let object = rdf.namedNode('http://example.org/object')
    let graph = rdf.namedNode('http://example.org/graph')
    let quad1 = rdf.quad(subject, predicate1, object, graph)
    let quad2 = rdf.quad(subject, predicate2, object, graph)
    let dataset = new Dataset([quad1, quad2])

    assert.equal(dataset.removeMatches(null, rdf.namedNode('http://example.org/predicate3'), null, null).length, 2)
    assert.equal(dataset.removeMatches(null, rdf.namedNode('http://example.org/predicate2'), null, null).length, 1)
    assert.equal(dataset.removeMatches(null, rdf.namedNode('http://example.org/predicate1'), null, null).length, 0)
  })

  it('.removeMatches should remove all quads that pass the object match pattern and return the dataset itself', () => {
    let subject = rdf.namedNode('http://example.org/subject')
    let predicate = rdf.namedNode('http://example.org/predicate')
    let object1 = rdf.namedNode('http://example.org/object1')
    let object2 = rdf.namedNode('http://example.org/object2')
    let graph = rdf.namedNode('http://example.org/graph')
    let quad1 = rdf.quad(subject, predicate, object1, graph)
    let quad2 = rdf.quad(subject, predicate, object2, graph)
    let dataset = new Dataset([quad1, quad2])

    assert.equal(dataset.removeMatches(null, null, rdf.namedNode('http://example.org/object3'), null).length, 2)
    assert.equal(dataset.removeMatches(null, null, rdf.namedNode('http://example.org/object2'), null).length, 1)
    assert.equal(dataset.removeMatches(null, null, rdf.namedNode('http://example.org/object1'), null).length, 0)
  })

  it('.removeMatches should remove all quads that pass the graph match pattern and return the dataset itself', () => {
    let subject = rdf.namedNode('http://example.org/subject')
    let predicate = rdf.namedNode('http://example.org/predicate')
    let object = rdf.namedNode('http://example.org/object')
    let graph1 = rdf.namedNode('http://example.org/graph1')
    let graph2 = rdf.namedNode('http://example.org/graph2')
    let quad1 = rdf.quad(subject, predicate, object, graph1)
    let quad2 = rdf.quad(subject, predicate, object, graph2)
    let dataset = new Dataset([quad1, quad2])

    assert.equal(dataset.removeMatches(null, null, null, rdf.namedNode('http://example.org/graph3')).length, 2)
    assert.equal(dataset.removeMatches(null, null, null, rdf.namedNode('http://example.org/graph2')) .length, 1)
    assert.equal(dataset.removeMatches(null, null, null, rdf.namedNode('http://example.org/graph1')).length, 0)
  })

  it('.some should return true if any quad pass the filter test', () => {
    let quad1 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('a'))

    let quad2 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('b'))

    let dataset = new Dataset([quad1, quad2])

    assert.equal(dataset.some(simpleFilter(rdf.namedNode('http://example.org/subject'), null, null)), true)
    assert.equal(dataset.some(simpleFilter(rdf.namedNode('http://example.org/subject1'), null, null)), false)
  })

  it('.toArray should return all quads in an array', () => {
    let quad1 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('a'))

    let quad2 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('b'))

    let dataset = new Dataset([quad1, quad2])
    let array = dataset.toArray()

    assert(quad1.equals(array[0]))
    assert(quad2.equals(array[1]))
  })

  it('.toCanonical should return the canonical representation', () => {
    let quad = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.blankNode())

    let dataset = new Dataset([quad])

    assert.equal(dataset.toCanonical(), '<http://example.org/subject> <http://example.org/predicate> _:c14n0 .\n', true)
  })

  it('.toStream should return a stream which emits all quads of the dataset', () => {
    let quad = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.blankNode())

    let dataset = new Dataset([quad])

    let stream = dataset.toStream()
    let output = []

    return new Promise((resolve, reject) => {
      stream.on('end', () => {
        if (output.length === 1 && quad.equals(output[0])) {
          resolve()
        } else {
          reject(new Error('no quads emitted'))
        }
      })

      stream.on('error', reject)

      stream.on('data', (quad) => {
        output.push(quad)
      })
    })
  })

  it('.toString should return the string represetation', () => {
    let blankNode = rdf.blankNode()
    let quad = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      blankNode)

    let dataset = new Dataset([quad])

    assert.equal(dataset.toString(), '<http://example.org/subject> <http://example.org/predicate> _:' + blankNode.value + ' .', true)
  })

  it ('Dataset.import should import quads from stream and create a new dataset', () => {
    let stream = new EventEmitter()
    let quad1 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('a'))

    let quad2 = rdf.quad(rdf.namedNode('http://example.org/subject'), rdf.namedNode('http://example.org/predicate'),
      rdf.literal('b'))

    let result = Dataset.import(stream)

    stream.emit('data', quad1)
    stream.emit('data', quad2)
    stream.emit('end')

    return result.then((dataset) => {
      assert.equal(quad1.equals(dataset._quads[0]), true)
      assert.equal(quad2.equals(dataset._quads[1]), true)
    })
  })
})
