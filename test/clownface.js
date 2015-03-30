(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.tests = root.tests || {};
    root.tests.clownface = factory();
  }
})(this, function () {
  return function (assert, rdf, readFile, utils, ctx) {
    describe('clownface', function () {
      describe('Graph', function () {
        it('should create a Graph object with constructor', function () {
          var cf = new rdf.cf.Graph(ctx.tbbtGraph);

          assert.equal(typeof cf.node, 'function');
          assert.equal(typeof cf.in, 'function');
          assert.equal(typeof cf.out, 'function');
          assert.equal(typeof cf.literal, 'function');
        });

        it('should create a Graph object with function call', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph);

          assert.equal(typeof cf.node, 'function');
          assert.equal(typeof cf.in, 'function');
          assert.equal(typeof cf.out, 'function');
          assert.equal(typeof cf.literal, 'function');
        });

        it('should create context from existing node object', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph);

          var result = cf.node(rdf.createNamedNode('http://localhost:8080/data/person/stuart-bloom')).nodes();

          assert.equal(result.length, 1);
          assert.equal(result[0].interfaceName, 'NamedNode');
          assert.equal(result[0].toString(), 'http://localhost:8080/data/person/stuart-bloom');
        });

        it('should create named node context', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph);

          var result = cf.node('http://localhost:8080/data/person/stuart-bloom').nodes();

          assert.equal(result.length, 1);
          assert.equal(result[0].interfaceName, 'NamedNode');
          assert.equal(result[0].toString(), 'http://localhost:8080/data/person/stuart-bloom');
        });

        it('should create literal node context', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph);

          var result = cf.node('2311 North Los Robles Avenue, Aparment 4A').nodes();

          assert.equal(result.length, 1);
          assert.equal(result[0].interfaceName, 'Literal');
          assert.equal(result[0].toString(), '2311 North Los Robles Avenue, Aparment 4A');
        });

        it('should create literal node context from number', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph);

          var result = cf.node(123).nodes();

          assert.equal(result.length, 1);
          assert.equal(result[0].interfaceName, 'Literal');
          assert.equal(result[0].toString(), '123');
        });

        it('should throw an error on unknown type', function () {
          var
            cf = rdf.cf.Graph(ctx.tbbtGraph),
            result,
            catched = false;

          try {
            result = cf.node(/.*/).nodes();
          } catch (e) {
            catched = true;
          }

          assert.equal(catched, true);
          assert.equal(result, undefined);
        });

        it('should create multiple nodes from array', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph);

          var result = cf.node(['1', '2']).nodes();

          assert.equal(result.length, 2);
          assert.equal(result[0].interfaceName, 'Literal');
          assert.equal(result[1].interfaceName, 'Literal');
        });

        it('.in should search object->subject', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph);

          var result = cf.node('2311 North Los Robles Avenue, Aparment 4A')
            .in('http://schema.org/streetAddress')
            .nodes();

          assert.equal(result.length, 2);
          assert.equal(result[0].interfaceName, 'BlankNode');
        });

        it('.in should search object->subject with multiple predicate values', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph);

          var result = cf.node('http://localhost:8080/data/person/bernadette-rostenkowski')
            .in(['http://schema.org/spouse', 'http://schema.org/knows'])
            .nodes();

          assert.equal(result.length, 8);
        });

        it('.out should search subject->object', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph);

          var result = cf.node('http://localhost:8080/data/person/amy-farrah-fowler')
            .out('http://schema.org/jobTitle')
            .nodes();

          assert.equal(result.length, 1);
          assert.equal(result[0].interfaceName, 'Literal');
          assert.equal(result[0].toString(), 'neurobiologist');
        });

        it('.out should search subject->object with multiple predicate values', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph);

          var result = cf.node('http://localhost:8080/data/person/bernadette-rostenkowski')
            .out(['http://schema.org/familyName', 'http://schema.org/givenName'])
            .nodes();

          assert.equal(result.length, 2);
        });

        it('.literal should return literal nodes as string', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph);

          var result = cf.node('1').literal();

          assert.equal(result.length, 1);
          assert.equal(result[0], '1');
        });

        it('.literal should return named nodes as string', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph);

          var result = cf.node('http://localhost:8080/data/person/bernadette-rostenkowski').literal();

          assert.equal(result.length, 1);
          assert.equal(result[0], 'http://localhost:8080/data/person/bernadette-rostenkowski');
        });

        it('.literal should return null if nodes wasn\t set', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph);

          var result = cf.literal();

          assert.equal(result, null);
        });
      });
    });
  };
});