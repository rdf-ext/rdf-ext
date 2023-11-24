import Environment from '@rdfjs/environment/Environment.js'
import IoFactory from '@rdfjs/io/Factory.js'
import NamespaceFactory from '@rdfjs/namespace/Factory.js'
import PrefixMapFactory from '@rdfjs/prefix-map/Factory.js'
import ScoreFactory from '@rdfjs/score/Factory.js'
import TermMapFactory from '@rdfjs/term-map/Factory.js'
import TermSetFactory from '@rdfjs/term-set/Factory.js'
import TraverserFactory from '@rdfjs/traverser/Factory.js'
import GrapoiFactory from 'grapoi/Factory.js'
import DataFactory from './DataFactory.js'
import DatasetFactory from './DatasetFactory.js'
import FetchFactory from './FetchFactory.js'
import FormatsFactory from './FormatsFactory.js'

const defaultEnv = new Environment([
  DataFactory,
  DatasetFactory,
  FetchFactory,
  FormatsFactory,
  GrapoiFactory,
  IoFactory,
  NamespaceFactory,
  PrefixMapFactory,
  ScoreFactory,
  TermMapFactory,
  TermSetFactory,
  TraverserFactory
], { bind: true })

export default defaultEnv
export {
  DataFactory,
  DatasetFactory,
  Environment,
  FetchFactory,
  FormatsFactory,
  GrapoiFactory,
  NamespaceFactory,
  PrefixMapFactory,
  ScoreFactory,
  TermMapFactory,
  TermSetFactory,
  TraverserFactory
}
