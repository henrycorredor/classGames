const { nanoid } = require('nanoid')

module.exports = function (io, gameSessions) {

	const masterSocket = io.of('/master')

	masterSocket.on('connection', (socket) => {
		let masterId = socket.handshake.query.id
		let roomNumber = socket.handshake.query.roomNumber

		const socketId = socket.id

		if (roomNumber !== '') {
			if (!gameSessions[roomNumber]) {
				socket.emit('inexistent-room')
			} else {
				gameSessions[roomNumber].masterInfo.socketId = socketId
			}
		}

		socket.on('create-room', (cb) => {
			roomNumber = Math.floor(Math.random() * 90000) + 10000
			masterId = nanoid()
			gameSessions[roomNumber] = {
				masterInfo: { id: masterId, socketId },
				students: []
			}
			cb(masterId, roomNumber, [])
			console.log(gameSessions)
		})
	})
}