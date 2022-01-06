import { Readable } from 'readable-stream'

function readableFrom (iterable) {
  let reading = false
  const iterator = iterable[Symbol.iterator]()

  const next = () => {
    try {
      const { value, done } = iterator.next()

      if (done) {
        readable.push(null)
      } else if (readable.push(value)) {
        next()
      } else {
        reading = false
      }
    } catch (err) {
      readable.destroy(err)
    }
  }

  const readable = new Readable({
    objectMode: true,
    read: () => {
      if (!reading) {
        reading = true
        next()
      }
    }
  })

  return readable
}

export default readableFrom
