import Environment from '@rdfjs/environment/Environment.js'
import FormatsFactory from '@rdfjs/environment/FormatsFactory.js'
import FetchFactory from '@rdfjs/fetch-lite/Factory.js'
import NamespaceFactory from '@rdfjs/namespace/Factory.js'
import PrefixMapFactory from '@rdfjs/prefix-map/Factory.js'
import ScoreFactory from '@rdfjs/score/Factory.js'
import TermMapFactory from '@rdfjs/term-map/Factory.js'
import TermSetFactory from '@rdfjs/term-set/Factory.js'
import TraverserFactory from '@rdfjs/traverser/Factory.js'
import ClownfaceFactory from './ClownfaceFactory.js'
import DataFactory from './DataFactory.js'
import DatasetFactory from './DatasetFactory.js'

const defaultEnv = new Environment([
  ClownfaceFactory,
  DataFactory,
  DatasetFactory,
  FetchFactory,
  FormatsFactory,
  NamespaceFactory,
  PrefixMapFactory,
  ScoreFactory,
  TermMapFactory,
  TermSetFactory,
  TraverserFactory
], { bind: true })

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
  ScoreFactory,
  TermMapFactory,
  TermSetFactory,
  TraverserFactory
}
