const Literal = require('rdf-data-model/lib/literal')
const NamedNode = require('./NamedNode')

const echarRegEx = new RegExp('["\\\\\n\r]') // eslint-disable-line no-control-regex
const echarRegExAll = new RegExp('["\\\\\n\r]', 'g') // eslint-disable-line no-control-regex

const echarReplacement = {
  '"': '\\"',
  '\\': '\\\\',
  '\n': '\\n',
  '\r': '\\r'
}

function echarReplacer (char) {
  return echarReplacement[char]
}

class LiteralExt extends Literal {
  toCanonical () {
    const escapedValue = LiteralExt.escapeValue(this.value)

    if (this.datatype.value === 'http://www.w3.org/2001/XMLSchema#string') {
      return '"' + escapedValue + '"'
    }

    if (this.datatype.value === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#langString') {
      return '"' + escapedValue + '"@' + this.language
    }

    return '"' + escapedValue + '"^^' + NamedNode.prototype.toCanonical.call(this.datatype)
  }

  toString () {
    return this.value
  }

  toJSON () {
    return {
      value: this.value,
      termType: this.termType,
      language: this.language,
      datatype: { value: this.datatype.value, termType: this.datatype.termType }
    }
  }

  static escapeValue (value) {
    if (echarRegEx.test(value)) {
      return value.replace(echarRegExAll, echarReplacer)
    } else {
      return value
    }
  }
}

module.exports = LiteralExt
