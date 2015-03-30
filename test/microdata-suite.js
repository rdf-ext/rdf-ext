(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.tests = root.tests || {};
    root.tests.microdataSuite = factory();
  }
})(this, function () {
  return function (assert, rdf, readFile, utils, ctx) {
    describe('microdata-rdf test suite', function () {
      var
        tests = [
          '0001',
          '0002',
          '0003',
          '0004',
          '0005',
          '0006',
          '0007',
          '0008',
          '0009',
          '0010',
          '0011',
          '0012',
          '0013',
          '0014',
          '0015',
          '0046',
          '0047',
          '0048',
          '0049',
          '0050',
          '0051',
          '0052',
          '0053',
          '0054',
          '0055',
          '0056',
          '0057',
          '0058',
          '0059',
          '0060',
          '0061',
          '0062',
          '0063',
          '0064',
          //'0065',
          //'0066',
          //'0067',
          '0068',
          '0069',
          '0070',
          //'0073',
          //'0074',
          '0075',
          '0076',
          '0077',
          '0078',
          '0079',
          '0080',
          //'0081',
          //'0082',
          '0083',
          //'0084'
        ],
        microdataParser = new rdf.promise.Parser(new rdf.MicrodataParser()),
        turtleParser = new rdf.promise.Parser(new rdf.TurtleParser());

      var runTest = function (number) {
        it('should pass test ' + number, function (done) {

          Promise.all([
            readFile('support/microdata-rdf/' + number + '.html'),
            readFile('support/microdata-rdf/' + number + '.ttl')
          ]).then(function (contents) {
            return Promise.all([
              microdataParser.parse(contents[0], 'http://example.com/' + number + '.html'),
              turtleParser.parse(contents[1], 'http://example.com/' + number + '.html')
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