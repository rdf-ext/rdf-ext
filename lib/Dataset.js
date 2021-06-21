const Dataset = require('@rdfjs/dataset/DatasetCore.js')
const { quadToNTriples } = require('@rdfjs/to-ntriples')
const normalize = require('rdf-normalize')
const { finished, Readable } = require('readable-stream')
const Quad = require('./Quad')

function createDataset (obj, quads) {
  return new obj.constructor(quads)
}

class DatasetExt extends Dataset {
  constructor (quads) {
    super(quads, DatasetExt.factory)
  }

  get length () {
    return this.size
  }

  addAll (quads) {
    for (const quad of quads) {
      this.add(quad)
    }

    return this
  }

  clone () {
    return createDataset(this, this)
  }

  difference (other) {
    return this.filter(quad => !other.has(quad))
  }

  every (callback) {
    return Array.from(this).every(quad => callback(quad, this))
  }

  filter (callback) {
    return createDataset(this, Array.from(this).filter(quad => callback(quad, this)))
  }

  forEach (callback) {
    Array.from(this).forEach(quad => callback(quad, this))
  }

  import (stream) {
    stream.on('data', quad => this.add(quad))

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

  includes (quad) {
    return this.has(quad)
  }

  intersection (other) {
    return this.filter(quad => other.includes(quad))
  }

  map (callback) {
    return createDataset(this, Array.from(this).map(quad => callback(quad, this)))
  }

  merge (other) {
    return (this.clone()).addAll(other)
  }

  remove (quad) {
    return this.delete(quad)
  }

  removeMatches (subject, predicate, object, graph) {
    const quads = this.match(subject, predicate, object, graph)

    for (const quad of quads) {
      this.delete(quad)
    }

    return this
  }

  some (callback) {
    return Array.from(this).some(quad => callback(quad, this))
  }

  toArray () {
    return Array.from(this)
  }

  toStream () {
    const stream = new Readable({
      objectMode: true,
      read: () => {
        for (const quad of this) {
          stream.push(quad)
        }

        stream.push(null)
      }
    })

    return stream
  }

  equals (other) {
    return this.toCanonical() === other.toCanonical()
  }

  toCanonical () {
    return normalize(this)
  }

  toString () {
    return this.toArray().map(quad => `${quadToNTriples(quad)}\n`).join('')
  }

  toJSON () {
    return this.toArray().map(quad => Quad.prototype.toJSON.call(quad))
  }
}

module.exports = DatasetExt
