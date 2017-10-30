const Io = require('socket.io')

const actors = {}

const stat = {
  red: { kill: 0, death: 0 },
  green: { kill: 0, death: 0 },
  blue: { kill: 0, death: 0 },
  yellow: { kill: 0, death: 0 },
}


// 소켓 생성
module.exports = function createSocket(http, m) {
  const io = Io(http)
  io.sockets.on('connection', (actor) => {
    console.log('new connection')
    actors[actor.id] = actor

    // 플레이어 접속
    actor.on('join player', (name) => {
      console.log(`join ${name}`)
      actor.status = {
        name,
        type: 'player'
      }

      stat[name].kill = 0
      stat[name].death = 0
    })

    // 상대방 접속
    actor.on('join enemy', (name) => {
      actor.status = {
        name,
        type: 'enemy'
      }
    })

    // 플레이어 조작
    actor.on('player controlled', (data) => {
      actor.broadcast.emit('enemy controlled', data)
    })

    // 플레이어 상태
    actor.on('player status', (data) => {
      actor.broadcast.emit('enemy status', data)
    })

    // 플레이어 부활
    actor.on('player respawn', (data) => {
      io.sockets.emit('enemy respawn', data)
    })

    // 플레이어 사망
    actor.on('player dead', (data) => {
      stat[data.id].death++
      stat[data.killed].kill++
    })

    // 접속 해제
    actor.on('disconnect', () => {
      console.log('disconnected ' + actor.id)
      delete actors[actor.id]
    })
    
    // 랭크 뿌려주기
    setInterval(() => {
      let rank = []

      for(const name in stat) {
        rank.push({
          id: name,
          kill: stat[name].kill,
          death: stat[name].death
        })
      }

      rank = rank.sort((a, b) => {
        if(a.kill > b.kill) return -1
        if(a.kill < b.kill) return 1
        else return 0
      })

      const result = {}
      for(const n in rank) {
        result[n*1+1] = rank[n]
      }

      io.sockets.emit('rank', result)
    }, 1000)
  })
}
