const { nanoid } = require('nanoid')

module.exports = function (io, gameSessions) {

	const masterSocket = io.of('/master')

	masterSocket.on('connection', (socket) => {
		const socketId = socket.id

		console.log('master conectado')

		socket.on('disconnect', () => {
			console.log('socket maestro desconectado ', socket.id)
		})

		socket.on('verify-room', (roomNumber, cb) => {
			cb(!gameSessions[roomNumber])
			console.log('maestro verifica sala', (!gameSessions[roomNumber]))
		})

		socket.on('create-room', (cb) => {
			roomNumber = Math.floor(Math.random() * 90000) + 10000
			masterId = nanoid()
			gameSessions[roomNumber] = {
				masterInfo: { id: masterId, socketId },
				students: []
			}
			cb(masterId, roomNumber, [])
			console.log(`sala número ${roomNumber} creada`)
		})
	})
}