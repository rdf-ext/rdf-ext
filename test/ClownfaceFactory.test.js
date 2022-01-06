import { strictEqual } from 'assert'
import { describe, it } from 'mocha'
import ClownfaceFactory from '../ClownfaceFactory.js'
import { DataFactory, DatasetFactory, Environment } from '../index.js'
import NamedNode from '../lib/NamedNode.js'

const env = new Environment([ClownfaceFactory, DataFactory, DatasetFactory])

describe('ClownfaceFactory', () => {
  it('should be a constructor', () => {
    strictEqual(typeof ClownfaceFactory, 'function')
  })

  describe('.clownface', () => {
    it('should be a method', () => {
      const factory = new ClownfaceFactory()

      strictEqual(typeof factory.clownface, 'function')
    })

    it('should use the environment as factory', () => {
      const ptr = env.clownface().namedNode('http://example.org/')

      strictEqual(ptr.term instanceof NamedNode, true)
    })

    it('should create a dataset if none is given and the environment implements DatasetFactory', () => {
      const ptr = env.clownface()

      strictEqual(typeof ptr.dataset, 'object')
      strictEqual(typeof ptr.dataset.match, 'function')
    })

    it('should not try to create a dataset if the environment doesn\'t implement DatasetFactory', () => {
      const env = new Environment([ClownfaceFactory, DataFactory])
      const ptr = env.clownface()

      strictEqual(typeof ptr.dataset, 'undefined')
    })

    it('should use the given dataset', () => {
      const dataset = env.dataset()
      const ptr = env.clownface({ dataset })

      strictEqual(ptr.dataset, dataset)
    })
  })
})
