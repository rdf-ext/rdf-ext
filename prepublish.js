var
  exec = require('child_process').exec;


var run = function (command, callback) {
  exec(command, function (error, stdout, stderr) {
    if (error != null) {
      console.error(error);
    }

    if (stderr.trim() !== '') {
      console.error(stderr.trim());
    }

    if (stdout.trim() !== '') {
      console.log(stdout.trim());
    }

    if (callback != null) {
      callback();
    }
  });
};

var browserify = function (source, target, callback) {
  run('./node_modules/.bin/browserify -d ' + source + ' -o ' + target, callback);
};

var uglify = function (source, target, callback) {
  run('./node_modules/.bin/uglifyjs ' + source + ' -o ' + target, callback);
};


browserify('rdf-ext.js', 'dist/rdf-ext.js', function () {
  uglify('dist/rdf-ext.js', 'dist/rdf-ext.min.js');
});
