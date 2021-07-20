import clownface from 'clownface'

class ClownfaceFactory {
  clownface ({ ...args } = {}) {
    return clownface({ ...args, factory: this })
  }
}

ClownfaceFactory.exports = ['clownface']

export default ClownfaceFactory
