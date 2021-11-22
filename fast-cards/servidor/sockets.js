const { Server } = require('socket.io')
const { nanoid } = require('nanoid')

module.exports = function (server) {
	const io = new Server(server, {
		cors: {
			origin: ['http://localhost:3000','http://localhost:3002']
		}
	})

	const masterSocket = io.of('/master')

	masterSocket.on('connection', (socket) => {
		let masterId = socket.handshake.query.id
		if (!masterId) {
			masterId = nanoid()
			socket.emit('register-master-id', masterId)
			console.log('emite la id ' + masterId)
		}
		console.log(`conectado usuario ${socket.id} id ${masterId}`)
	})
}