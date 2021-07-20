import Traverser from './lib/Traverser.js'

class TraverserFactory {
  traverser (filter, { backward = false, forward = true } = {}) {
    return new Traverser({ backward, factory: this, filter, forward })
  }
}

TraverserFactory.exports = ['traverser']

export default TraverserFactory
