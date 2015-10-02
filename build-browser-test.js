var browserify = require('browserify')
var fs = require('fs')
var path = require('path')

browserify('./test/test.js').bundle().pipe(fs.createWriteStream('./test/support/browser-test.js'))

try {
  fs.unlinkSync('./test/support/mocha.css')
} catch (e) {}

try {
  fs.unlinkSync('./test/support/mocha.js')
} catch (e) {}

try {
  fs.unlinkSync('./test/support/tbbt.nt')
} catch (e) {}

fs.symlinkSync(path.join(path.dirname(require.resolve('mocha')), 'mocha.css'), './test/support/mocha.css')
fs.symlinkSync(path.join(path.dirname(require.resolve('mocha')), 'mocha.js'), './test/support/mocha.js')
fs.symlinkSync(path.join(path.dirname(require.resolve('rdf-test-data')), 'node_modules/tbbt-ld/dist/tbbt.nt'), './test/support/tbbt.nt')
