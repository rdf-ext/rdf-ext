class Serializers {
  constructor (serializers) {
    if (serializers) {
      Object.keys(serializers).forEach((mediaType) => {
        this[mediaType] = serializers[mediaType]
      })
    }
  }

  find (mediaType) {
    if (!(mediaType in this)) {
      return null
    }

    return this[mediaType]
  }

  import (mediaType, input, options) {
    const serializer = this.find(mediaType)

    if (!serializer) {
      return null
    }

    return serializer.import(input, options)
  }

  list () {
    const propertyBlackList = ['find', 'import', 'list']

    return Object.keys(this).filter((property) => {
      return propertyBlackList.indexOf(property) === -1
    })
  }
}

module.exports = Serializers
