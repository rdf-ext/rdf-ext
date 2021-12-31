import rdf from '../../index.js'

const example = {
  subject: rdf.namedNode('http://example.org/subject'),
  subject1: rdf.namedNode('http://example.org/subject1'),
  subject2: rdf.namedNode('http://example.org/subject2'),
  subject3: rdf.namedNode('http://example.org/subject3'),
  predicate: rdf.namedNode('http://example.org/predicate'),
  predicate1: rdf.namedNode('http://example.org/predicate1'),
  predicate2: rdf.namedNode('http://example.org/predicate2'),
  predicate3: rdf.namedNode('http://example.org/predicate3'),
  object: rdf.literal('object'),
  object1: rdf.literal('1'),
  object2: rdf.literal('2'),
  object3: rdf.literal('3'),
  graph: rdf.namedNode('http://example.org/graph'),
  graph1: rdf.namedNode('http://example.org/graph1'),
  graph2: rdf.namedNode('http://example.org/graph2'),
  graph3: rdf.namedNode('http://example.org/graph3')
}

example.quad = rdf.quad(example.subject, example.predicate, example.object, example.graph)
example.quad1 = rdf.quad(example.subject, example.predicate, example.object1, example.graph)
example.quad2 = rdf.quad(example.subject, example.predicate, example.object2, example.graph)
example.quad3 = rdf.quad(example.subject, example.predicate, example.object3, example.graph)

export default example
