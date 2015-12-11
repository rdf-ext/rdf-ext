function Parsers (parsers) {
  var self = this

  if (parsers) {
    Object.keys(parsers).forEach(function (mediaType) {
      self[mediaType] = parsers[mediaType]
    })
  }
}

Parsers.prototype.list = function () {
  var propertyBlackList = ['list', 'findParsers', 'parse', 'process', 'stream']

  return Object.keys(this)
    .filter(function (property) {
      return propertyBlackList.indexOf(property) === -1
    })
}

Parsers.prototype.findParsers = function (mediaType) {
  if (!(mediaType in this)) {
    return null
  }

  var parsers = this[mediaType]

  if (!Array.isArray(parsers)) {
    parsers = [parsers]
  }

  return parsers
}

Parsers.prototype.parse = function (mediaType, data, callback, base, filter, graph) {
  var parsers = this.findParsers(mediaType)

  if (!parsers) {
    return Promise.reject('no parser for mime type: ' + mediaType + ' found')
  }

  // TODO: try other parsers on error
  return parsers.shift().parse(data, callback, base, filter, graph)
}

Parsers.prototype.process = function (mediaType, data, callback, base, filter, done) {
  var parsers = this.findParsers(mediaType)

  if (!parsers) {
    return Promise.reject('no parser for mime type: ' + mediaType + ' found')
  }

  // TODO: try other parsers on error
  return parsers.shift().process(data, callback, base, filter, done)
}

Parsers.prototype.stream = function (mediaType, inputStream, base, filter) {
  var parsers = this.findParsers(mediaType)

  if (!parsers) {
    return null
  }

  // TODO: try other parsers on error
  return parsers.shift().stream(inputStream, base, filter)
}

module.exports = Parsers
