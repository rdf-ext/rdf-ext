import rdfMediaTypes from '@rdfjs/io/mediaTypes.js'
import fileFetchFactory from 'file-fetch/factory.js'
import httpFetch from 'nodeify-fetch'
import protoFetch from 'proto-fetch'

const fileFetch = fileFetchFactory({
  contentType: ext => rdfMediaTypes.get(ext.slice(1))
})

const fetch = protoFetch({
  [null]: fileFetch,
  file: fileFetch,
  http: httpFetch,
  https: httpFetch
})

export default fetch
