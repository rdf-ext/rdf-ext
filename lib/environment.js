function mixin (rdf) {
  rdf.PrefixMap = function (prefixes) {
    this.addAll(prefixes)
  }

  rdf.PrefixMap.prototype.addAll = function (prefixes) {
    for (var prefix in prefixes) {
      this[prefix] = prefixes[prefix]
    }
  }

  rdf.PrefixMap.prototype.resolve = function (curie) {
    if (curie.indexOf('://') !== -1) {
      throw new Error('string looks like an IRI')
    }

    var separator = curie.indexOf(':')

    if (separator === -1) {
      throw new Error('separator not found')
    }

    var prefix = curie.substr(0, separator).toLowerCase()

    if (!(prefix in this)) {
      throw new Error('prefix is not defined')
    }

    return this[prefix].concat(curie.substr(separator + 1))
  }

  rdf.PrefixMap.prototype.setDefault = function (namespace) {
    this[''] = namespace
  }

  rdf.PrefixMap.prototype.shrink = function (iri) {
    var reserved = ['addAll', 'resolve', 'setDefault', 'shrink']

    for (var prefix in this) {
      if (reserved.indexOf(prefix) !== -1) {
        continue
      }

      var namespace = this[prefix]

      if (iri.substr(0, namespace.length) === namespace) {
        return prefix + ':' + iri.substr(namespace.length)
      }
    }

    return iri
  }

  rdf.TermMap = function (i) {
    return Object.defineProperties({}, {
      resolve: {
        writable: false, configurable: false, enumerable: true, value: function (term) {
          if (this[term]) { return this[term] }
          if (this['']) { return this[''].concat(term) }
          return null
        }
      },
      shrink: {
        writable: false, configurable: false, enumerable: true, value: function (iri) {
          for (var t in this) {
            if (this[t] === iri) {
              return t
            }
          }

          return iri
        }
      },
      setDefault: {
        writable: false, configurable: false, enumerable: true, value: function (iri) {
          this[''] = iri
        }
      },
      addAll: {
        writable: false, configurable: false, enumerable: true, value: function (terms, override) {
          for (var t in terms) {
            if (!this[t] || override) {
              this[t] = terms[t]
            }
          }

          return this
        }
      }
    }).addAll(i)
  }

  rdf.Profile = function (i) {
    return Object.defineProperties({}, {
      prefixes: {writable: false, configurable: false, enumerable: true, value: new rdf.PrefixMap()},
      terms: {writable: false, configurable: false, enumerable: true, value: new rdf.TermMap()},
      resolve: {
        writable: false, configurable: false, enumerable: true, value: function (tp) {
          return tp.indexOf(':') >= 0 ? this.prefixes.resolve(tp) : this.terms.resolve(tp)
        }
      },
      setDefaultVocabulary: {
        writable: false, configurable: false, enumerable: true, value: function (iri) {
          this.terms.setDefault(iri)
        }
      },
      setDefaultPrefix: {
        writable: false, configurable: false, enumerable: true, value: function (iri) {
          this.prefixes.setDefault(iri)
        }
      },
      setTerm: {
        writable: false, configurable: false, enumerable: true, value: function (term, iri) {
          this.terms[term] = iri
        }
      },
      setPrefix: {
        writable: false, configurable: false, enumerable: true, value: function (prefix, iri) {
          this.prefixes[prefix] = iri
        }
      },
      importProfile: {
        writable: false, configurable: false, enumerable: true, value: function (profile, override) {
          if (!profile) { return this }
          this.prefixes.addAll(profile.prefixes, override)
          this.terms.addAll(profile.terms, override)
          return this
        }
      }
    }).importProfile(i)
  }

  rdf.RDFEnvironment = function () {
    var rp = {
      terms: {}, prefixes: {
        owl: 'http://www.w3.org/2002/07/owl#',
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        rdfa: 'http://www.w3.org/ns/rdfa#',
        xhv: 'http://www.w3.org/1999/xhtml/vocab#',
        xml: 'http://www.w3.org/XML/1998/namespace',
        xsd: 'http://www.w3.org/2001/XMLSchema#'
      }
    }

    var xsd = {}

    var x = ['string', 'boolean', 'dateTime', 'date', 'time', 'int', 'double', 'float', 'decimal', 'integer',
      'nonPositiveInteger', 'negativeInteger', 'long', 'int', 'short', 'byte', 'nonNegativeInteger',
      'unsignedLong', 'unsignedInt', 'unsignedShort', 'unsignedByte', 'positiveInteger']

    for (var v in x) {
      xsd[x[v]] = rp.prefixes.xsd.concat(x[v])
    }

    return Object.defineProperties(new rdf.Profile(rp), {
      createBlankNode: {
        writable: false, configurable: false, enumerable: true, value: function () {
          return new rdf.BlankNode()
        }
      },
      createNamedNode: {
        writable: false, configurable: false, enumerable: true, value: function (iri) {
          return new rdf.NamedNode(iri)
        }
      },
      createLiteral: {
        writable: false, configurable: false, enumerable: true, value: function (value, language, datatype) {
          return new rdf.Literal(value, language, datatype)
          /* var l = null
          var dt = arguments[2]
          var v = value

          if (arguments[1]) {
            if (arguments[1].hasOwnProperty('interfaceName')) {
              dt = arguments[1]
            } else {
              l = arguments[1]
            }
          }

          if (dt) {
            switch (dt.valueOf()) {
              case xsd.string:
                v = String(v)
                break
              case xsd['boolean']:
                v = (Boolean(v === 'false' ? false : v)).valueOf()
                break
              case xsd['float']:
              case xsd.integer:
              case xsd['long']:
              case xsd['double']:
              case xsd.decimal:
              case xsd.nonPositiveInteger:
              case xsd.nonNegativeInteger:
              case xsd.negativeInteger:
              case xsd['int']:
              case xsd.unsignedLong:
              case xsd.positiveInteger:
              case xsd['short']:
              case xsd.unsignedInt:
              case xsd['byte']:
              case xsd.unsignedShort:
              case xsd.unsignedByte:
                v = (Number(v)).valueOf()
                break
              case xsd['date']:
              case xsd.time:
              case xsd.dateTime:
                v = new Date(v)
                break
            }
          }

          return new rdf.Literal(value, l, dt, v) */
        }
      },
      createTriple: {
        writable: false, configurable: false, enumerable: true, value: function (s, p, o) {
          return new rdf.Triple(s, p, o)
        }
      },
      createGraph: {
        writable: false, configurable: true, enumerable: true, value: function (a) {
          return new rdf.Graph(a)
        }
      },
      createAction: {
        writable: false, configurable: false, enumerable: true, value: function (t, a) {
          return new rdf.TripleAction(t, a)
        }
      },
      createProfile: {
        writable: false, configurable: false, enumerable: true, value: function (empty) {
          return new rdf.Profile(!empty ? this : null)
        }
      },
      createTermMap: {
        writable: false, configurable: false, enumerable: true, value: function (empty) {
          return new rdf.TermMap(!empty ? this.terms : null)
        }
      },
      createPrefixMap: {
        writable: false, configurable: false, enumerable: true, value: function (empty) {
          return new rdf.PrefixMap(!empty ? this.prefixes : null)
        }
      }
    })
  }

  var singleton = new rdf.RDFEnvironment()

  Object.keys(singleton).forEach(function (property) {
    rdf[property] = singleton[property]
  })
}

module.exports = mixin
