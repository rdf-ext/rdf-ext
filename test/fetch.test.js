import { strictEqual } from 'assert'
import { describe, it } from 'mocha'
import decode from 'stream-chunks/decode.js'
import fetch from '../lib/fetch.js'

describe('fetch', () => {
  it('should be a function', () => {
    strictEqual(typeof fetch, 'function')
  })

  it('should read the content of a file', async () => {
    const expected = '<http://example.org/subject>  <http://example.org/predicate> "object".'

    const res = await fetch(new URL('support/example.nt', import.meta.url))
    const result = await decode(res.body)

    strictEqual(result.trim(), expected)
  })

  it('should return the correct content type', async () => {
    const res = await fetch(new URL('support/example.nt', import.meta.url))

    strictEqual(res.headers.get('content-type'), 'application/n-triples')
  })
})
