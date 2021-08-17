function forEach ({ backward, callback, dataset, filter, forward, term, visited }) {
  const next = (term, level) => {
    const checkMatches = matches => {
      for (const quad of matches) {
        if (visited.has(quad)) {
          continue
        }

        visited.add(quad)

        const args = { dataset, level, quad }

        if (filter(args)) {
          callback(args)

          if (forward) {
            next(quad.object, level + 1)
          }

          if (backward) {
            next(quad.subject, level + 1)
          }
        }
      }
    }

    if (forward) {
      checkMatches(dataset.match(term))
    }

    if (backward) {
      checkMatches(dataset.match(null, null, term))
    }
  }

  next(term, 0)
}

class Traverser {
  constructor ({ backward = false, factory, filter, forward = true }) {
    this.backward = backward
    this.factory = factory
    this.filter = filter
    this.forward = forward
  }

  forEach ({ term, dataset }, callback) {
    forEach({
      backward: this.backward,
      callback,
      dataset,
      filter: this.filter,
      forward: this.forward,
      term,
      visited: this.factory.dataset()
    })
  }

  match ({ term, dataset }) {
    const result = this.factory.dataset()

    forEach({
      backward: this.backward,
      callback: ({ quad }) => result.add(quad),
      dataset,
      filter: this.filter,
      forward: this.forward,
      term,
      visited: this.factory.dataset()
    })

    return result
  }

  reduce ({ term, dataset }, callback, initialValue) {
    let result = initialValue

    forEach({
      backward: this.backward,
      callback: args => {
        result = callback(args, result)
      },
      dataset,
      filter: this.filter,
      forward: this.forward,
      term,
      visited: this.factory.dataset()
    })

    return result
  }
}

export default Traverser
