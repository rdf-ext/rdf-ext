var http = require('http')
var https = require('https')
var url = require('url')

var utils = {}

utils.defaultRequest = function (method, requestUrl, headers, content, callback) {

  // support require module compatible function call
  if (typeof method === 'object') {
    callback = requestUrl
    requestUrl = method.url
    headers = method.headers
    content = method.body
    method = method.method
  }

  return new Promise(function (resolve, reject) {
    callback = callback || function () {}

    var options = url.parse(requestUrl)
    var client = http

    options.hash = null
    options.method = method
    options.headers = headers

    if (options.protocol === 'https:') {
      client = https
    }

    var req = client.request(options, function (res) {
      var resContent = ''

      res.setEncoding('utf8')

      res.on('data', function (chunk) {
        resContent += chunk
      })

      res.on('end', function () {
        callback(res.statusCode, res.headers, resContent)

        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          content: resContent
        })
      })
    })

    req.on('error', function (error) {
      callback(null, null, null, error)

      reject(error)
    })

    if (content) {
      req.write(content)
    }

    req.end()
  })
}

utils.mixin = function (rdf) {
  rdf.defaultRequest = utils.defaultRequest
}

module.exports = utils.mixin
