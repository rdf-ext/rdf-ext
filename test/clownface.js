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

        it('should create an empty node context', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph);

          var result = cf.nodes();

          assert(Array.isArray(result));
          assert.equal(result.length, 0);
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

        it('.graph should return the graph object', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph);

          assert.equal(cf.graph(), ctx.tbbtGraph);
        }),

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

        it('.removeIn should remove triples based on the object value', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph.merge(rdf.createGraph()));

          cf.node('http://localhost:8080/data/person/bernadette-rostenkowski')
            .removeIn();

          assert.equal(cf.graph().length, 118);
        });

        it('.removeIn should remove triples based on the object value and predicate', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph.merge(rdf.createGraph()));

          cf.node('http://localhost:8080/data/person/bernadette-rostenkowski')
            .removeIn('http://schema.org/knows');

          assert.equal(cf.graph().length, 119);
        });

        it('.removeIn should remove triples based on the object value and multiple predicates', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph.merge(rdf.createGraph()));

          cf.node('http://localhost:8080/data/person/bernadette-rostenkowski')
            .removeIn(['http://schema.org/knows', 'http://schema.org/spouse']);

          assert.equal(cf.graph().length, 118);
        });


        it('.removeOut should remove triples based on the object value', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph.merge(rdf.createGraph()));

          cf.node('http://localhost:8080/data/person/bernadette-rostenkowski')
            .removeOut();

          assert.equal(cf.graph().length, 113);
        });

        it('.removeOut should remove triples based on the object value and predicate', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph.merge(rdf.createGraph()));

          cf.node('http://localhost:8080/data/person/bernadette-rostenkowski')
            .removeOut('http://schema.org/knows');

          assert.equal(cf.graph().length, 119);
        });

        it('.removeOut should remove triples based on the object value and multiple predicates', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph.merge(rdf.createGraph()));

          cf.node('http://localhost:8080/data/person/bernadette-rostenkowski')
            .removeOut(['http://schema.org/knows', 'http://schema.org/spouse']);

          assert.equal(cf.graph().length, 118);
        });

        it('.toArray should return an empty array if no node was selected', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph);

          var result = cf.toArray();

          assert.deepEqual(result, []);
        });

        it('.toArray should return every single node wrapped in a cf.Graph object array', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph);

          var result = cf.node('http://localhost:8080/data/person/bernadette-rostenkowski')
            .in('http://schema.org/knows')
            .toArray();

          assert(Array.isArray(result));
          assert.equal(result.length, 7);
          assert(result[0] instanceof rdf.cf.Graph);
        });

        it('.forEach should iterate over all nodes', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph);

          var count = 0;

          cf.node('http://localhost:8080/data/person/bernadette-rostenkowski')
            .in('http://schema.org/knows')
            .forEach(function (item) {
              assert(item instanceof rdf.cf.Graph);
              count++;
            });

          assert.equal(count, 7);
        });

        it('.map should iterate over all nodes and return an array of the callback return value', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph);

          var result = cf.node('http://localhost:8080/data/person/bernadette-rostenkowski')
            .in('http://schema.org/knows')
            .map(function (item, index) {
              assert(item instanceof rdf.cf.Graph);

              return index;
            });

          assert.deepEqual(result, [0, 1, 2, 3, 4, 5, 6]);
        });

        it('.toString should return the .literal string of a single node', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph);

          var givenName = cf.node('http://localhost:8080/data/person/bernadette-rostenkowski')
            .out('http://schema.org/givenName')
            .toString();

          assert.equal(givenName, 'Bernadette');
        });

        it('.toString should return a comma separated string of .literal strings', function () {
          var cf = rdf.cf.Graph(ctx.tbbtGraph);

          var givenName = cf.node([
            'http://localhost:8080/data/person/bernadette-rostenkowski',
            'http://localhost:8080/data/person/howard-wolowitz'
          ])
            .out('http://schema.org/givenName')
            .toString();

          assert.equal(givenName, 'Bernadette,Howard');
        });
      });





      describe('Store', function () {
        it('should create a Store object with constructor', function () {
          var cf = new rdf.cf.Store(ctx.tbbtStore);

          //TODO: add missing functions
          assert.equal(typeof cf.node, 'function');
          assert.equal(typeof cf.in, 'function');
          assert.equal(typeof cf.out, 'function');
          assert.equal(typeof cf.literal, 'function');
          assert.equal(typeof cf.jump, 'function');
        });

        it('should create a Store object with function call', function () {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          assert.equal(typeof cf.node, 'function');
          assert.equal(typeof cf.in, 'function');
          assert.equal(typeof cf.out, 'function');
          assert.equal(typeof cf.literal, 'function');
        });

        it('should create an empty node context', function () {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          var result = cf.nodes();

          assert(Array.isArray(result));
          assert.equal(result.length, 0);
        });

        it('should create context from existing node object', function (done) {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          cf.node(rdf.createNamedNode('http://localhost:8080/data/person/stuart-bloom'), null, function (result) {
            result = result.nodes();

            assert.equal(result.length, 1);
            assert.equal(result[0].interfaceName, 'NamedNode');
            assert.equal(result[0].toString(), 'http://localhost:8080/data/person/stuart-bloom');

            done();
          })
          .catch(function (error) {
            done(error);
          });
        });

        it('.node should support Promise .then', function (done) {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          cf.node(rdf.createNamedNode('http://localhost:8080/data/person/stuart-bloom'))
            .then(function (result) {
              result = result.nodes();

              assert.equal(result.length, 1);
              assert.equal(result[0].interfaceName, 'NamedNode');
              assert.equal(result[0].toString(), 'http://localhost:8080/data/person/stuart-bloom');

              done();
            })
            .catch(function (error) {
              done(error);
            });
        });

        it('should create named node context', function (done) {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          cf.node('http://localhost:8080/data/person/stuart-bloom', null, function (result) {
            result = result.nodes();

            assert.equal(result.length, 1);
            assert.equal(result[0].interfaceName, 'NamedNode');
            assert.equal(result[0].toString(), 'http://localhost:8080/data/person/stuart-bloom');

            done();
          })
          .catch(function (error) {
            done(error);
          });
        });

        it('should create literal node context', function (done) {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          cf.node('2311 North Los Robles Avenue, Aparment 4A', null, function (result) {
            result = result.nodes();

            assert.equal(result.length, 1);
            assert.equal(result[0].interfaceName, 'Literal');
            assert.equal(result[0].toString(), '2311 North Los Robles Avenue, Aparment 4A');

            done();
          })
          .catch(function (error) {
            done(error);
          });
        });

        it('should create literal node context from number', function (done) {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          cf.node(123, null, function (result) {
            result = result.nodes();

            assert.equal(result.length, 1);
            assert.equal(result[0].interfaceName, 'Literal');
            assert.equal(result[0].toString(), '123');

            done();
          })
          .catch(function (error) {
            done(error);
          });
        });

        it('should throw an error on unknown type', function () {
          var
            cf = rdf.cf.Store(ctx.tbbtStore),
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

        it('should create multiple nodes from array', function (done) {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          cf.node(['1', '2'], null, function (result) {
            result = result.nodes();

            assert.equal(result.length, 2);
            assert.equal(result[0].interfaceName, 'Literal');
            assert.equal(result[1].interfaceName, 'Literal');

            done();
          })
          .catch(function (error) {
            done(error);
          });
        });

        it('.store should return the store object', function () {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          assert.equal(cf.store(), ctx.tbbtStore);
        });

        it('.in should search object->subject', function (done) {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          cf.node('2311 North Los Robles Avenue, Aparment 4A', 'http://localhost:8080/data/person/sheldon-cooper', function (result) {
            result = result
              .in('http://schema.org/streetAddress')
              .nodes();

            assert.equal(result.length, 1);
            assert.equal(result[0].interfaceName, 'BlankNode');

            done();
          })
          .catch(function (error) {
            done(error);
          });
        });

        it('.in should search object->subject with multiple predicate values', function (done) {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          cf.node('http://localhost:8080/data/person/bernadette-rostenkowski', 'http://localhost:8080/data/person/howard-wolowitz', function (result) {
            result = result
              .in(['http://schema.org/spouse', 'http://schema.org/knows'])
              .nodes();

            assert.equal(result.length, 2);

            done();
          })
          .catch(function (error) {
            done(error);
          });
        });

        it('.out should search subject->object', function () {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          cf.node('http://localhost:8080/data/person/amy-farrah-fowler', null, function (result) {
            result = result
              .out('http://schema.org/jobTitle')
              .nodes();

            assert.equal(result.length, 1);
            assert.equal(result[0].interfaceName, 'Literal');
            assert.equal(result[0].toString(), 'neurobiologist');

            done();
          })
          .catch(function (error) {
            done(error);
          });
        });

        it('.out should search subject->object with multiple predicate values', function () {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          cf.node('http://localhost:8080/data/person/bernadette-rostenkowski', null, function (result) {
            result = result
              .out(['http://schema.org/familyName', 'http://schema.org/givenName'])
              .nodes();

            assert.equal(result.length, 2);

            done();
          })
          .catch(function (error) {
            done(error);
          });
        });

        it('.jump should cross named graph borders', function (done) {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          cf.node('http://localhost:8080/data/person/bernadette-rostenkowski', null, function (result) {
            return result
              .out('http://schema.org/knows')
              .jump(function (result) {
                result = result.nodes().length;

                assert(result, 7);

                done();
              })
              .catch(function (error) {
                done(error);
              })
            });
        });

        it('.jump should support Promise .then', function (done) {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          cf.node('http://localhost:8080/data/person/bernadette-rostenkowski', null, function (result) {
            return result
              .out('http://schema.org/knows')
              .jump()
              .then(function (result) {
                result = result.nodes().length;

                assert(result, 7);

                done();
              })
              .catch(function (error) {
                done(error);
              })
          });
        });

        it('.literal should return literal nodes as string', function () {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          cf.node('Maryann', 'http://localhost:8080/data/person/bernadette-rostenkowski', function (result) {
            result = result
              .literal();

            assert.equal(result.length, 1);
            assert.equal(result[0], 'Maryann');

            done();
          })
          .catch(function (error) {
            done(error);
          });
        });

        it('.literal should return named nodes as string', function () {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          cf.node('http://localhost:8080/data/person/bernadette-rostenkowski', null, function (result) {
            result = result
              .literal();

            assert.equal(result.length, 1);
            assert.equal(result[0], 'http://localhost:8080/data/person/bernadette-rostenkowski');

            done();
          })
          .catch(function (error) {
            done(error);
          });
        });

        it('.literal should return null if nodes wasn\t set', function () {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          var result = cf.literal();

          assert.equal(result, null);
        });

        it('.toArray should return an empty array if no node was selected', function () {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          var result = cf.toArray();

          assert.deepEqual(result, []);
        });

        it('.toArray should return every single node wrapped in a cf.Graph object array', function () {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          cf.node('http://localhost:8080/data/person/bernadette-rostenkowski', null, function (result) {
            result = result
              .in('http://schema.org/knows')
              .toArray();

            assert(Array.isArray(result));
            assert.equal(result.length, 7);
            assert(result[0] instanceof rdf.cf.Store);

            done();
          })
          .catch(function (error) {
            done(error);
          });
        });

        it('.forEach should iterate over all nodes', function () {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          var count = 0;

          cf.node('http://localhost:8080/data/person/bernadette-rostenkowski', null, function (result) {
            result = result
              .in('http://schema.org/knows')
              .forEach(function (item) {
                assert(item instanceof rdf.cf.Store);
                count++;
              });

            assert.equal(count, 7);

            done();
          })
          .catch(function (error) {
            done(error);
          });
        });

        it('.map should iterate over all nodes and return an array of the callback return value', function () {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          cf.node('http://localhost:8080/data/person/bernadette-rostenkowski', null, function (result) {
            result = result
              .in('http://schema.org/knows')
              .map(function (item, index) {
                assert(item instanceof rdf.cf.Store);

                return index;
              });

            assert.deepEqual(result, [0, 1, 2, 3, 4, 5, 6]);

            done();
          })
          .catch(function (error) {
            done(error);
          });
        });

        it('.toString should return the .literal string of a single node', function () {
          var cf = rdf.cf.Store(ctx.tbbtStore);

           cf.node('http://localhost:8080/data/person/bernadette-rostenkowski', null, function (result) {
             var givenName = result
               .out('http://schema.org/givenName')
               .toString();

             assert.equal(givenName, 'Bernadette');

             done();
           })
           .catch(function (error) {
             done(error);
           });
        });

        it('.toString should return a comma separated string of .literal strings', function () {
          var cf = rdf.cf.Store(ctx.tbbtStore);

          cf.node([
            'http://localhost:8080/data/person/bernadette-rostenkowski',
            'http://localhost:8080/data/person/howard-wolowitz'
          ], null, function (result) {
            var givenName = result
              .out('http://schema.org/givenName')
              .toString();

            assert.equal(givenName, 'Bernadette,Howard');

            done();
          })
          .catch(function (error) {
            done(error);
          });
        });
      });
    });
  };
});