import standard from '@rdfjs/data-model/test/index.js'
import { describe } from 'mocha'
import DataFactory from '../DataFactory.js'
import { Environment } from '../index.js'

const env = new Environment([DataFactory])

describe('DataFactory', () => {
  describe('test suite', () => {
    standard(env)
  })
})
