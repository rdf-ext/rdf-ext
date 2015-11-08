/* global XMLHttpRequest */
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

    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function () {
      if (xhr.readyState === xhr.DONE) {
        var headerLines = xhr.getAllResponseHeaders().split('\r\n')
        var resHeaders = {}

        for (var i = 0; i < headerLines.length; i++) {
          var headerLine = headerLines[i].split(': ', 2)

          resHeaders[headerLine[0].toLowerCase()] = headerLine[1]
        }

        callback(xhr.status, resHeaders, xhr.responseText)

        resolve({
          statusCode: xhr.status,
          headers: resHeaders,
          content: xhr.responseText
        })
      }
    }

    xhr.open(method, requestUrl, true)

    for (var header in headers) {
      xhr.setRequestHeader(header, headers[header])
    }

    xhr.send(content)
  })
}

utils.corsProxyRequest = function (proxyUrl, method, requestUrl, headers, content, callback) {
  var url = proxyUrl + '?url=' + encodeURIComponent(requestUrl)

  return utils.defaultRequest(method, url, headers, content, callback)
}

utils.mixin = function (rdf) {
  rdf.defaultRequest = utils.defaultRequest
  rdf.corsProxyRequest = utils.corsProxyRequest
}

module.exports = utils.mixin
