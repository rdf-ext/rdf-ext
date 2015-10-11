var tests = [
  require('./environment'),
  require('./utils')
]

describe('RDF-Ext', function() {
  tests.forEach(function (test) {
    test()
  })
})
