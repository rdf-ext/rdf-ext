import fromTerm from '@rdfjs/data-model/lib/fromTerm.js'
import BlankNode from './lib/BlankNode.js'
import DefaultGraph from './lib/DefaultGraph.js'
import Literal from './lib/Literal.js'
import NamedNode from './lib/NamedNode.js'
import Quad from './lib/Quad.js'
import Variable from './lib/Variable.js'

const langStringDatatype = new NamedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#langString')
const stringDatatype = new NamedNode('http://www.w3.org/2001/XMLSchema#string')

class DataFactory {
  init () {
    this._data = {
      blankNodeCounter: 0,
      defaultGraph: new DefaultGraph()
    }
  }

  namedNode (value) {
    return new NamedNode(value)
  }

  blankNode (value) {
    value = value || ('b' + (++this._data.blankNodeCounter))

    return new BlankNode(value)
  }

  literal (value, languageOrDatatype) {
    if (typeof languageOrDatatype === 'string') {
      return new Literal(value, languageOrDatatype, langStringDatatype)
    } else {
      return new Literal(value, '', languageOrDatatype || stringDatatype)
    }
  }

  variable (value) {
    return new Variable(value)
  }

  defaultGraph () {
    return this._data.defaultGraph
  }

  quad (subject, predicate, object, graph = this.defaultGraph()) {
    return new Quad(subject, predicate, object, graph)
  }

  fromTerm (original) {
    return fromTerm(this, original)
  }

  fromQuad (original) {
    return fromTerm(this, original)
  }
}

DataFactory.exports = [
  'namedNode',
  'blankNode',
  'literal',
  'variable',
  'defaultGraph',
  'quad',
  'fromTerm',
  'fromQuad'
]

export default DataFactory
