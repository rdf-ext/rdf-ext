'use strict'

const normalize = require('rdf-normalize')
const Source = require('rdf-source')

class SimpleDataset {
  constructor (quads) {
    this._quads = []

    if (quads) {
      this.addAll(quads)
    }
  }

  get length () {
    return this._quads.length
  }

  add (quad) {
    if (!this.includes(quad)) {
      this._quads.push(quad)
    }

    return this
  }

  addAll (quads) {
    quads.forEach((quad) => {
      this.add(quad)
    })

    return this
  }

  clone () {
    return new SimpleDataset(this._quads)
  }

  difference (other) {
    return new SimpleDataset(this.filter((quad) => {
      return !other.includes(quad)
    }))
  }

  equals (other) {
    return this.toCanonical() === other.toCanonical()
  }

  every (callback) {
    return this._quads.every((quad) => {
      return callback(quad, this)
    })
  }

  filter (callback) {
    return new SimpleDataset(this._quads.filter((quad) => {
      return callback(quad, this)
    }))
  }

  forEach (callback) {
    this._quads.forEach((quad) => {
      callback(quad, this)
    })
  }

  import (stream) {
    return new Promise ((resolve, reject) => {
      stream.on('end', () => {
        resolve(this)
      })

      stream.on('error', reject)

      stream.on('data', (quad) => {
        this.add(quad)
      })
    })
  }

  includes (quad) {
    return this.some((other) => {
      return other.equals(quad)
    })
  }

  intersection (other) {
    return new SimpleDataset(this.filter((quad) => {
      return other.includes(quad)
    }))
  }

  map (callback) {
    return this._quads.map((quad) => {
      return callback(quad, this)
    })
  }

  match (subject, predicate, object, graph) {
    return new SimpleDataset(this.filter((quad) => {
      if (subject && !quad.subject.equals(subject)) {
        return false
      }

      if (predicate && !quad.predicate.equals(predicate)) {
        return false
      }

      if (object && !quad.object.equals(object)) {
        return false
      }

      if (graph && !quad.graph.equals(graph)) {
        return false
      }

      return true
    }))
  }

  merge (other) {
    return (new SimpleDataset(this._quads)).addAll(other)
  }

  remove(quad) {
    let index = this._quads.findIndex((other) => {
      return other.equals(quad)
    })

    if (index !== -1) {
      this._quads.splice(index, 1)
    }

    return this
  }

  removeMatches (subject, predicate, object, graph) {
    this.match(subject, predicate, object, graph).forEach((quad) => {
      this.remove(quad)
    })

    return this
  }

  some (callback) {
    return this._quads.some((quad) => {
      return callback(quad, this)
    })
  }

  toArray () {
    return this._quads.slice()
  }

  toCanonical () {
    return normalize(this)
  }

  toStream () {
    let stream = new Source()

    this.forEach((quad) => {
      stream.push(quad)
    })

    stream.push(null)

    return stream
  }

  toString () {
    return this._quads.map((quad) => {
      return quad.toCanonical() + ' .'
    }).join ('\n')
  }

  static import (stream) {
    let dataset = new SimpleDataset()

    return dataset.import(stream)
  }
}

module.exports = SimpleDataset
