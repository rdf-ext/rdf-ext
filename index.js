const streams = require('./lib/streams')
const Parsers = require('./lib/parsers')
const Serializers = require('./lib/serializers')

let DataFactory = require('./lib/DataFactory')

DataFactory.asEvent = streams.asEvent
DataFactory.waitFor = streams.waitFor
DataFactory.Parsers = Parsers
DataFactory.Serializers = Serializers

module.exports = DataFactory
