import { finished } from 'readable-stream'

class PrefixMap extends Map {
  constructor (factory, prefixes = []) {
    super()

    this.factory = factory

    for (const [prefix, namespace] of prefixes) {
      this.set(prefix, namespace)
    }
  }

  resolve (term) {
    if (term.value.indexOf('://') !== -1) {
      return null
    }

    const separatorOffset = term.value.indexOf(':')

    if (separatorOffset === -1) {
      return null
    }

    const prefix = term.value.slice(0, separatorOffset).toLowerCase()

    if (!this.has(prefix)) {
      return null
    }

    return this.factory.namedNode(this.get(prefix).value.concat(term.value.slice(separatorOffset + 1)))
  }

  shrink (term) {
    if (!term) {
      return null
    }

    const all = [...this]
      .filter(([, namespace]) => term.value.startsWith(namespace))
      .map(([prefix, namespace]) => this.factory.namedNode(prefix + ':' + term.value.slice(namespace.value.length)))
      .sort((a, b) => a.value.length - b.value.length)

    return all[0] || null
  }

  import (stream) {
    stream.on('prefix', (prefix, namespace) => {
      this.set(prefix, namespace)
    })

    return new Promise((resolve, reject) => {
      finished(stream, err => {
        if (err) {
          reject(err)
        } else {
          resolve(this)
        }
      })
    })
  }

  export (stream) {
    for (const [prefix, namespace] of this) {
      stream.emit('prefix', prefix, namespace)
    }

    return this
  }
}

export default PrefixMap
