import PrefixMap from './lib/PrefixMap.js'

class PrefixMapFactory {
  init () {
    this.prefixes = new PrefixMap(this)
  }

  clone (original) {
    if (original.prefixes) {
      for (const [prefix, term] of original.prefixes) {
        this.prefixes.set(prefix, term)
      }
    }
  }

  prefixMap (prefixes) {
    return new PrefixMap(this, prefixes)
  }
}

PrefixMapFactory.exports = ['prefixMap']

export default PrefixMapFactory
