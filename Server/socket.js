
const Io = require('socket.io')

const actors = {}


// 소켓 생성
module.exports = function createSocket(http, m) {
  const io = Io(http)
  io.sockets.on('connection', (actor) => {
    console.log('new connection')
    actors[actor.id] = actor

    actor.on('disconnected', () => delete actors[actor.id])

    actor.on('join player', (name) => {
      console.log(`join ${name}`)
      actor.status = {
        name,
        type: 'player'
      }
    })

    actor.on('join enemy', (name) => {
      actor.status = {
        name,
        type: 'enemy'
      }
    })

    actor.on('player controlled', (data) => {
      // actor.broadcast.emit('enemy controlled', data)
      io.sockets.emit('enemy controlled', data)
    })
  })
}
