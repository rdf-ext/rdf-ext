const streams = require('./streams')

class PrefixMap {
  constructor (factory, prefixes) {
    this.factory = factory
    this.map = {}

    if (prefixes) {
      this.addAll(prefixes.map || prefixes)
    }
  }

  clone () {
    return new PrefixMap(this.factory, this)
  }

  addAll (prefixes) {
    for (let prefix in prefixes) {
      const namespace = prefixes[prefix]

      this.map[prefix] = this.factory.namedNode(namespace.value || namespace)
    }

    return this
  }

  resolve (curie) {
    curie = curie.value || curie

    if (curie.indexOf('://') !== -1) {
      return null
    }

    const separatorOffset = curie.indexOf(':')

    if (separatorOffset === -1) {
      return null
    }

    const prefix = curie.substr(0, separatorOffset).toLowerCase()

    if (!(prefix in this.map)) {
      return null
    }

    return this.factory.namedNode(this.map[prefix].value.concat(curie.substr(separatorOffset + 1)))
  }

  shrink (iri) {
    iri = iri.value || iri

    for (let prefix in this.map) {
      const namespace = this.map[prefix].value

      if (iri.substr(0, namespace.length) === namespace) {
        return this.factory.namedNode(prefix + ':' + iri.substr(namespace.length))
      }
    }

    return null
  }

  import (stream) {
    stream.on('prefix', (prefix, namespace) => {
      this.map[prefix] = namespace
    })

    return streams.waitFor(stream).then(() => {
      return this
    })
  }

  export (stream) {
    Object.keys(this.map).forEach((prefix) => {
      stream.emit('prefix', prefix, this.map[prefix])
    })

    return this
  }
}

module.exports = PrefixMap
