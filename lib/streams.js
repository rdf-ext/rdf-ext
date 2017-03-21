const Event = require('events').EventEmitter

function asEvent (p) {
  let event = new Event()

  Promise.resolve().then(() => {
    return p()
  }).then(() => {
    event.emit('end')
  }).catch((err) => {
    event.emit('error', err)
  })

  return event
}

function waitFor (event) {
  return new Promise((resolve, reject) => {
    event.on('end', resolve)
    event.on('error', reject)
  })
}

module.exports = {
  asEvent: asEvent,
  waitFor: waitFor
}
