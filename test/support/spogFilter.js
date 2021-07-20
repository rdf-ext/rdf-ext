function spogFilter (subject, predicate, object, graph) {
  return quad => {
    return (!subject || quad.subject.equals(subject)) &&
      (!predicate || quad.predicate.equals(predicate)) &&
      (!object || quad.object.equals(object)) &&
      (!graph || quad.graph.equals(graph))
  }
}

export default spogFilter
