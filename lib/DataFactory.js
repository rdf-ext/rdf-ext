'use strict'

const BlankNode = require('./BlankNode')
const DataFactory = require('@rdfjs/data-model')
const Dataset = require('./Dataset')
const DefaultGraph = require('./DefaultGraph')
const Literal = require('./Literal')
const NamedNode = require('./NamedNode')
const PrefixMap = require('./PrefixMap')
const Quad = require('./Quad')
const Variable = require('./Variable')

class DataFactoryExt extends DataFactory {
  static namedNode (value) {
    return new DataFactoryExt.defaults.NamedNode(value)
  }

  static blankNode (value) {
    return new DataFactoryExt.defaults.BlankNode(value)
  }

  static literal (value, languageOrDatatype) {
    if (typeof languageOrDatatype === 'string') {
      if (languageOrDatatype.indexOf(':') === -1) {
        return new DataFactoryExt.defaults.Literal(value, languageOrDatatype)
      } else {
        return new DataFactoryExt.defaults.Literal(value, null, DataFactory.namedNode(languageOrDatatype))
      }
    } else {
      return new DataFactoryExt.defaults.Literal(value, null, languageOrDatatype)
    }
  }

  static variable (value) {
    return new DataFactoryExt.defaults.Variable(value)
  }

  static defaultGraph () {
    return DataFactoryExt.defaults.defaultGraph
  }

  static triple (subject, predicate, object) {
    return DataFactoryExt.quad(subject, predicate, object)
  }

  static quad (subject, predicate, object, graph) {
    return new DataFactoryExt.defaults.Quad(subject, predicate, object, graph || DataFactoryExt.defaults.defaultGraph)
  }

  static graph (quads) {
    let dataset = new DataFactoryExt.defaults.Dataset()

    if (quads) {
      quads.forEach((quad) => {
        dataset.add(DataFactoryExt.quad(quad.subject, quad.predicate, quad.object))
      })
    }

    return dataset
  }

  static dataset (quads, graph) {
    let dataset = new DataFactoryExt.defaults.Dataset()

    if (quads) {
      if (graph) {
        quads.forEach((quad) => {
          dataset.add(DataFactoryExt.quad(
            quad.subject,
            quad.predicate,
            quad.object,
            graph
          ))
        })
      } else {
        dataset.addAll(quads)
      }
    }

    return dataset
  }

  static prefixMap (prefixes) {
    return new DataFactoryExt.defaults.PrefixMap(this, prefixes)
  }
}

DataFactoryExt.defaults = {
  defaultGraph: new DefaultGraph(),
  NamedNode: NamedNode,
  BlankNode: BlankNode,
  Literal: Literal,
  Variable: Variable,
  Quad: Quad,
  Dataset: Dataset,
  PrefixMap: PrefixMap
}

Dataset.factory = DataFactoryExt

module.exports = DataFactoryExt
