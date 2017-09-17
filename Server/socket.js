
const Io = require('socket.io');


// 소켓 생성
module.exports = function createSocket(http, m) {
  const io = Io(http)
  io.sockets.on('connection', (socket) => {
    console.log('new connection');

    socket.on('player key pressed', () => {
      console.log('jump!');
      socket.broadcast.emit('other key pressed', {})
    })
  })
};
