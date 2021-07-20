import { strictEqual } from 'assert'
import { describe, it } from 'mocha'
import ClownfaceFactory from '../ClownfaceFactory.js'
import { DataFactory, Environment } from '../index.js'
import NamedNode from '../lib/NamedNode.js'

const env = new Environment([ClownfaceFactory, DataFactory])

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
  })
})
