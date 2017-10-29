const Io = require('socket.io')

const actors = {}

const rank = {
  '1': { kill: 0, death: 0 },
  '2': { kill: 0, death: 0 },
  '3': { kill: 0, death: 0 },
  '4': { kill: 0, death: 0 },
}


// 소켓 생성
module.exports = function createSocket(http, m) {
  const io = Io(http)
  io.sockets.on('connection', (actor) => {
    console.log('new connection')
    actors[actor.id] = actor

    actor.on('join player', (name) => {
      console.log(`join ${name}`)
      actor.status = {
        name,
        type: 'player'
      }

      rank[name].kill = 0
      rank[name].death = 0
    })

    actor.on('join enemy', (name) => {
      actor.status = {
        name,
        type: 'enemy'
      }
    })

    actor.on('player controlled', (data) => {
      actor.broadcast.emit('enemy controlled', data)
      // io.sockets.emit('enemy controlled', data)
    })

    actor.on('player status', (data) => {
      actor.broadcast.emit('enemy status', data)
      // io.sockets.emit('enemy status', data)
    })

    actor.on('player respawn', (data) => {
      io.sockets.emit('enemy respawn', data)
    })

    actor.on('player dead', (data) => {
      rank[data.id].death++
      rank[data.killed].kill++
      console.log(rank)
    })

    actor.on('disconnect', () => {
      console.log('disconnected ' + actor.id)
      delete actors[actor.id]
    })

    setInterval(() => {
      io.sockets.emit('rank', rank)
    }, 1000)
  })
}
