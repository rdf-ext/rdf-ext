import formats from '@rdfjs/formats'
import FormatsFactoryBase from '@rdfjs/formats/Factory.js'

class FormatsFactory extends FormatsFactoryBase {
  init () {
    super.init()

    this.formats.import(formats)
  }
}

export default FormatsFactory
