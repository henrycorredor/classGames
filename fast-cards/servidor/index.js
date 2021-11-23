const { nanoid } = require('nanoid')
const io = require("socket.io")(
	3000, {
	cors: {
		origin: ['http://localhost:3001', 'http://localhost:3002']
	}
})

const gameSessions = {}

const masterSocket = io.of('/master')

masterSocket.on('connection', (socket) => {
	let masterId = socket.handshake.query.id
	let roomNumber = socket.handshake.query.roomNumber
	const socketId = socket.id
	if (!masterId) {
		roomNumber = Math.floor(Math.random() * 90000) + 10000
		masterId = nanoid()
		gameSessions[roomNumber] = { masterInfo: { id: masterId, socketId } }
		socket.emit('register-game-session', { masterId, roomNumber })
	} else {
		if (gameSessions[roomNumber]) {
			gameSessions[roomNumber].masterInfo.socketId = socketId
		} else {
			gameSessions[roomNumber] = { masterInfo: { id: masterId, socketId } }
		}
	}
	console.log(gameSessions)
})