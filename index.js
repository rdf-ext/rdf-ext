const streams = require('./lib/streams')
const Parsers = require('./lib/parsers')
const Serializers = require('./lib/serializers')

let DataFactoryExt = require('./lib/data-factory-ext')

DataFactoryExt.asEvent = streams.asEvent
DataFactoryExt.waitFor = streams.waitFor
DataFactoryExt.Parsers = Parsers
DataFactoryExt.Serializers = Serializers

module.exports = DataFactoryExt
