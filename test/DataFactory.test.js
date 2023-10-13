import { strictEqual } from 'assert'
import testSuite from '@rdfjs/data-model/test/index.js'
import mocha from 'mocha'
import DataFactory from '../DataFactory.js'
import { Environment } from '../index.js'

const env = new Environment([DataFactory])

mocha.describe('DataFactory', () => {
  mocha.describe('test suite', () => {
    testSuite({ factory: env, mocha })
  })

  mocha.describe('namedNode', () => {
    mocha.it('should accept URL objects and convert them to strings', () => {
      const iri = 'http://example.org/path?query=value'
      const namedNode = env.namedNode(new URL(iri))

      strictEqual(namedNode.value, iri)
    })
  })
})
