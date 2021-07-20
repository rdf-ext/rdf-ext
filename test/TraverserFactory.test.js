import { strictEqual } from 'assert'
import { describe, it } from 'mocha'
import { Environment } from '../index.js'
import Traverser from '../lib/Traverser.js'
import TraverserFactory from '../TraverserFactory.js'

const env = new Environment([TraverserFactory])

describe('TraverserFactory', function () {
  describe('.traverser', () => {
    it('should be a method', () => {
      strictEqual(typeof env.traverser, 'function')
    })

    it('should return a Traverser instance', () => {
      const traverser = env.traverser()

      strictEqual(traverser instanceof Traverser, true)
    })
  })
})
