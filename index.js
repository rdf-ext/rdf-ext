import Environment from '@rdfjs/environment/Environment.js'
import FetchFactory from '@rdfjs/environment/FetchFactory.js'
import FormatsFactory from '@rdfjs/environment/FormatsFactory.js'
import NamespaceFactory from '@rdfjs/environment/NamespaceFactory.js'
import TermMapSetFactory from '@rdfjs/environment/TermMapSetFactory.js'
import ClownfaceFactory from './ClownfaceFactory.js'
import DataFactory from './DataFactory.js'
import DatasetFactory from './DatasetFactory.js'
import PrefixMapFactory from './PrefixMapFactory.js'
import TraverserFactory from './TraverserFactory.js'

const defaultEnv = new Environment([
  ClownfaceFactory,
  DataFactory,
  DatasetFactory,
  FetchFactory,
  FormatsFactory,
  NamespaceFactory,
  PrefixMapFactory,
  TermMapSetFactory,
  TraverserFactory
])

export default defaultEnv
export {
  ClownfaceFactory,
  DataFactory,
  DatasetFactory,
  Environment,
  FetchFactory,
  FormatsFactory,
  NamespaceFactory,
  PrefixMapFactory,
  TermMapSetFactory,
  TraverserFactory
}
