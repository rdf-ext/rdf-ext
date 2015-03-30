(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.tests = root.tests || {};
    root.tests.rdfaSuite = factory();
  }
})(this, function () {
  return function (assert, rdf, readFile, utils, ctx) {
    describe('RDFa test suite', function () {
      var
        base = 'http://www.w3.org/2006/07/SWD/RDFa/testsuite/testcases/',
        tests = [
          '000002',
          '000003',
          //'000004',
          //'000005',
          //'000006',
          '000007',
          '000008',
          '000010',
          //'000011',
          '000012',
          //'000013',
          //'000014',
          //'000015',
          '000016',
          //'000017',
          '000019',
          //'000020',
          '000101',
          '000102',
          '000103',
          //'000104',
          //'000105',
          //'000106',
          '000107',
          //'000108',
          '000109',
          '000110',
          //'000112',
          '000113'
        ],
        rdfaParser = new rdf.promise.Parser(new rdf.RdfaParser()),
        turtleParser = new rdf.promise.Parser(new rdf.TurtleParser());

      var runTest = function (number) {
        it('should pass test ' + number, function (done) {

          Promise.all([
            readFile('support/rdfa/' + number + '.html'),
            readFile('support/rdfa/' + number + '.ttl')
          ]).then(function (contents) {
            return Promise.all([
              rdfaParser.parse(contents[0], base + number + '.html'),
              turtleParser.parse(contents[1], base + number + '.html')
            ])
          }).then(function (graphs) {
            return utils.p.assertGraphEqual(graphs[0], graphs[1]);
          }).then(function () {
            done()
          }).catch(function (error) {
            done(error);
          })
        });
      };

      tests.forEach(function (number) {
        runTest(number);
      })
    });
  };
});
