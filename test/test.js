var tests = [
  require('./utils')
]

describe('RDF-Ext', function() {
  tests.forEach(function (test) {
    test()
  })
})
