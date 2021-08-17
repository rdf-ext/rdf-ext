import { deepStrictEqual, strictEqual } from 'assert'
import rdf from '../../index.js'

const ns = rdf.namespace('http://example.org/')

class TraverserExample {
  constructor ({
    backward = false,
    dataset,
    filterCalls = [],
    filter = () => true,
    forEachCalls = [],
    forward = true,
    match,
    reduce,
    reduceCalls = [],
    term
  }) {
    this.backward = backward

    this.filterCalls = filterCalls.map(({ level, quad }) => {
      return {
        level,
        quad: rdf.quad(quad[0], quad[1], quad[2], quad[3])
      }
    })

    this.forEachCalls = forEachCalls.map(({ level, quad }) => {
      return {
        level,
        quad: rdf.quad(quad[0], quad[1], quad[2], quad[3])
      }
    })

    this.reduceCalls = reduceCalls.map(({ level, quad, result }) => {
      return [
        {
          level,
          quad: rdf.quad(quad[0], quad[1], quad[2], quad[3])
        },
        result
      ]
    })

    this.dataset = rdf.dataset(dataset.map(data => {
      return rdf.quad(data[0], data[1], data[2], data[3])
    }))

    this.filterCallback = filter
    this.reduceCallback = reduce

    this.forward = forward

    this.match = rdf.dataset(match && match.map(data => {
      return rdf.quad(data[0], data[1], data[2], data[3])
    }))

    this.term = term

    this.factory = rdf
    this.actualFilterCalls = []
    this.actualForEachCalls = []
    this.actualReduceCalls = []
    this.filter = this._filter.bind(this)
    this.forEach = this._forEach.bind(this)
    this.reduce = this._reduce.bind(this)
  }

  _filter (...args) {
    this.actualFilterCalls.push(args)

    return this.filterCallback(...args)
  }

  _forEach (...args) {
    this.actualForEachCalls.push(args)
  }

  _reduce (...args) {
    this.actualReduceCalls.push(args)

    if (this.reduceCallback) {
      return this.reduceCallback(...args)
    }
  }

  checkFilterCalls () {
    strictEqual(this.actualFilterCalls.length, this.filterCalls.length)

    this.filterCalls.forEach((filterCall, index) => {
      const actualFilterCall = this.actualFilterCalls[index]

      strictEqual(actualFilterCall[0].quad.toString(), filterCall.quad.toString())
      strictEqual(actualFilterCall[0].dataset, this.dataset)
      strictEqual(actualFilterCall[0].level, filterCall.level)
    })
  }

  checkForEachCalls () {
    strictEqual(this.actualForEachCalls.length, this.forEachCalls.length)

    this.forEachCalls.forEach((forEachCall, index) => {
      const actualForEachCall = this.actualForEachCalls[index]

      strictEqual(actualForEachCall[0].quad.toString(), forEachCall.quad.toString())
      strictEqual(actualForEachCall[0].dataset, this.dataset)
      strictEqual(actualForEachCall[0].level, forEachCall.level)
    })
  }

  checkReduceCalls () {
    strictEqual(this.actualReduceCalls.length, this.reduceCalls.length)

    this.reduceCalls.forEach((reduceCall, index) => {
      const actualReduceCall = this.actualReduceCalls[index]

      strictEqual(actualReduceCall[0].quad.toString(), reduceCall[0].quad.toString(), true)
      strictEqual(actualReduceCall[0].dataset, this.dataset)
      strictEqual(actualReduceCall[0].level, reduceCall[0].level)
      deepStrictEqual(actualReduceCall[1], reduceCall[1])
    })
  }

  checkMatch (result) {
    strictEqual(result.toCanonical(), this.match.toCanonical())
  }
}

function backwardStop () {
  return new TraverserExample({
    forward: false,
    backward: true,
    term: ns.d,
    dataset: [
      [ns.a, ns.p2, ns.b],
      [ns.b, ns.p2, ns.c],
      [ns.c, ns.p1, ns.d]
    ],
    filter: ({ quad }) => quad.predicate.equals(ns.p1),
    filterCalls: [{
      level: 0,
      quad: [ns.c, ns.p1, ns.d]
    }, {
      level: 1,
      quad: [ns.b, ns.p2, ns.c]
    }]
  })
}

function callbackCall () {
  return new TraverserExample({
    term: ns.a,
    dataset: [
      [ns.a, ns.p1, ns.b],
      [ns.b, ns.p1, ns.c],
      [ns.c, ns.p2, ns.d]
    ],
    filter: ({ quad }) => quad.predicate.equals(ns.p1),
    forEachCalls: [{
      level: 0,
      quad: [ns.a, ns.p1, ns.b]
    }, {
      level: 1,
      quad: [ns.b, ns.p1, ns.c]
    }],
    reduceCalls: [{
      level: 0,
      quad: [ns.a, ns.p1, ns.b]
    }, {
      level: 1,
      quad: [ns.b, ns.p1, ns.c]
    }]
  })
}

function filterCall () {
  return new TraverserExample({
    term: ns.a,
    dataset: [
      [ns.a, ns.p1, ns.b],
      [ns.b, ns.p1, ns.c]
    ],
    filterCalls: [{
      level: 0,
      quad: [ns.a, ns.p1, ns.b]
    }, {
      level: 1,
      quad: [ns.b, ns.p1, ns.c]
    }]
  })
}

function forwardStop () {
  return new TraverserExample({
    term: ns.a,
    dataset: [
      [ns.a, ns.p1, ns.b],
      [ns.b, ns.p2, ns.c],
      [ns.c, ns.p2, ns.d]
    ],
    filter: ({ quad }) => quad.predicate.equals(ns.p1),
    filterCalls: [{
      level: 0,
      quad: [ns.a, ns.p1, ns.b]
    }, {
      level: 1,
      quad: [ns.b, ns.p2, ns.c]
    }]
  })
}

function visitOnce () {
  return new TraverserExample({
    term: ns.a,
    dataset: [
      [ns.a, ns.p1, ns.b],
      [ns.b, ns.p2, ns.a]
    ],
    filterCalls: [{
      level: 0,
      quad: [ns.a, ns.p1, ns.b]
    }, {
      level: 1,
      quad: [ns.b, ns.p2, ns.a]
    }]
  })
}

export default TraverserExample
export {
  backwardStop,
  callbackCall,
  filterCall,
  forwardStop,
  visitOnce
}
