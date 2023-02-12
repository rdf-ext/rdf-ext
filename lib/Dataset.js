import Dataset from '@rdfjs/dataset/DatasetCore.js'
import normalize from '@rdfjs/normalize'
import toNT from '@rdfjs/to-ntriples'
import { finished } from 'readable-stream'
import readableFrom from './readableFrom.js'

function createDataset (obj, quads) {
  return new obj.constructor(quads)
}

class DatasetExt extends Dataset {
  addAll (quads) {
    for (const quad of quads) {
      this.add(quad)
    }

    return this
  }

  clone () {
    return createDataset(this, this)
  }

  deleteMatches (subject, predicate, object, graph) {
    for (const quad of this.match(subject, predicate, object, graph)) {
      this.delete(quad)
    }

    return this
  }

  difference (other) {
    return this.filter(quad => !other.has(quad))
  }

  equals (other) {
    return this.toCanonical() === other.toCanonical()
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

  intersection (other) {
    return this.filter(quad => other.has(quad))
  }

  map (callback) {
    return createDataset(this, Array.from(this).map(quad => callback(quad, this)))
  }

  merge (other) {
    return (this.clone()).addAll(other)
  }

  reduce (callback, initialValue) {
    return Array.from(this).reduce((value, quad, index) => callback(value, quad, index, this), initialValue)
  }

  some (callback) {
    return Array.from(this).some(quad => callback(quad, this))
  }

  toCanonical () {
    return normalize(this)
  }

  toStream () {
    return readableFrom(this)
  }

  toString () {
    return toNT(this)
  }
}

export default DatasetExt
