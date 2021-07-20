import { strictEqual } from 'assert'
import { describe, it } from 'mocha'
import { DataFactory, Environment } from '../index.js'
import PrefixMap from '../lib/PrefixMap.js'
import PrefixMapFactory from '../PrefixMapFactory.js'
import example from './support/exampleData.js'

const env = new Environment([DataFactory, PrefixMapFactory])

describe('PrefixMapFactory', () => {
  it('should be a constructor', () => {
    strictEqual(typeof PrefixMapFactory, 'function')
  })

  describe('.prefixMap', () => {
    it('should be a method', () => {
      strictEqual(typeof env.prefixMap, 'function')
    })

    it('should return a new PrefixMap instance', () => {
      const prefixes = env.prefixMap()

      strictEqual(prefixes instanceof PrefixMap, true)
    })

    it('should add the given prefixes to the new instance', () => {
      const prefixes = env.prefixMap([
        ['ex1', example.prefix1],
        ['ex2', example.prefix2]
      ])

      strictEqual(prefixes.size, 2)
      strictEqual(prefixes.get('ex1').equals(example.prefix1), true)
      strictEqual(prefixes.get('ex2').equals(example.prefix2), true)
    })
  })

  describe('.prefixes', () => {
    it('should be a PrefixMap property', () => {
      strictEqual(env.prefixes instanceof PrefixMap, true)
    })

    it('should be copied into a cloned environment instance', () => {
      const original = new Environment([DataFactory, PrefixMapFactory])
      original.prefixes.set('ex', example.prefix1)

      const clone = original.clone()

      strictEqual(clone.prefixes.size, 1)
      strictEqual(clone.prefixes.get('ex').equals(example.prefix1), true)
    })
  })
})
