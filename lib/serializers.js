function Serializers (serializers) {
  var self = this

  if (serializers) {
    Object.keys(serializers).forEach(function (mediaType) {
      self[mediaType] = serializers[mediaType]
    })
  }
}

Serializers.prototype.list = function () {
  var propertyBlackList = ['list', 'findSerializer', 'serialize', 'stream']

  return Object.keys(this)
    .filter(function (property) {
      return propertyBlackList.indexOf(property) === -1
    })
}

Serializers.prototype.findSerializer = function (mediaType) {
  if (!(mediaType in this)) {
    return null
  }

  return this[mediaType]
}

Serializers.prototype.serialize = function (mediaType, graph, callback) {
  var serializer = this.findSerializer(mediaType)

  if (!serializer) {
    return Promise.reject('no serializer for mime type: ' + mediaType + ' found')
  }

  return serializer.serialize(graph, callback)
}

Serializers.prototype.stream = function (mediaType, inputStream, base, filter) {
  var serializer = this.findSerializer(mediaType)

  if (!serializer) {
    return null
  }

  return serializer.stream(inputStream, base, filter)
}

module.exports = Serializers
