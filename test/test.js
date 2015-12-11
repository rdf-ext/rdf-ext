/* global describe */
var tests = [
  require('./environment'),
  require('./parsers'),
  require('./serializers'),
  require('./utils')
]

describe('RDF-Ext', function () {
  tests.forEach(function (test) {
    test()
  })
})
