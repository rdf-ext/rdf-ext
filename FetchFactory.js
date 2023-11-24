import FetchFactoryBase from '@rdfjs/fetch-lite/Factory.js'
import fetch from './lib/fetch.js'

class FetchFactory extends FetchFactoryBase {
  init () {
    super.init()

    this.fetch.config('fetch', fetch)
  }
}

export default FetchFactory
