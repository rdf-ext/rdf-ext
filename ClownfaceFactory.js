import clownface from 'clownface'

class ClownfaceFactory {
  clownface ({ ...args } = {}) {
    console.warn([
      'clownface is deprecated and will be removed in the next minor version.',
      'Please switch to grapoi.',
      'It offers an almost fully compatible interface with more features.'].join(' '))

    if (!args.dataset && typeof this.dataset === 'function') {
      args.dataset = this.dataset()
    }

    return clownface({ ...args, factory: this })
  }
}

ClownfaceFactory.exports = ['clownface']

export default ClownfaceFactory
