function fromTerm (factory, original) {
  if (!original) {
    return null
  }

  if (original.termType === 'BlankNode') {
    return factory.blankNode(original.value)
  }

  if (original.termType === 'DefaultGraph') {
    return factory.defaultGraph()
  }

  if (original.termType === 'Literal') {
    return factory.literal(original.value, original.language || factory.namedNode(original.datatype.value))
  }

  if (original.termType === 'NamedNode') {
    return factory.namedNode(original.value)
  }

  if (original.termType === 'Quad') {
    const subject = factory.fromTerm(original.subject)
    const predicate = factory.fromTerm(original.predicate)
    const object = factory.fromTerm(original.object)
    const graph = factory.fromTerm(original.graph)

    return factory.quad(subject, predicate, object, graph)
  }

  if (original.termType === 'Variable') {
    return factory.variable(original.value)
  }

  throw new Error(`unknown termType ${original.termType}`)
}

export default fromTerm
