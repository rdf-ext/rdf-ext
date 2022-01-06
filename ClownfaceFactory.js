import clownface from 'clownface'

class ClownfaceFactory {
  clownface ({ ...args } = {}) {
    if (!args.dataset && typeof this.dataset === 'function') {
      args.dataset = this.dataset()
    }

    return clownface({ ...args, factory: this })
  }
}

ClownfaceFactory.exports = ['clownface']

export default ClownfaceFactory
