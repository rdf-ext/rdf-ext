import testSuite from '@rdfjs/data-model/test/index.js'
import mocha from 'mocha'
import DataFactory from '../DataFactory.js'
import { Environment } from '../index.js'

const env = new Environment([DataFactory])

mocha.describe('DataFactory', () => {
  mocha.describe('test suite', () => {
    testSuite({ factory: env, mocha })
  })
})
