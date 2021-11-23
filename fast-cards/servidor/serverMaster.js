const { nanoid } = require('nanoid')

module.exports = function (io, gameSessions) {

	const masterSocket = io.of('/master')

	masterSocket.on('connection', (socket) => {
		let masterId = socket.handshake.query.id
		let roomNumber = socket.handshake.query.roomNumber
		const socketId = socket.id
		if (!masterId) {
			roomNumber = Math.floor(Math.random() * 90000) + 10000
			masterId = nanoid()
			gameSessions[roomNumber] = { masterInfo: { id: masterId, socketId } }
			socket.emit('register-game-session', { masterId, roomNumber, students: [] })
		} else {
			if (gameSessions[roomNumber]) {
				gameSessions[roomNumber].masterInfo.socketId = socketId
			} else {
				gameSessions[roomNumber] = { masterInfo: { id: masterId, socketId } }
			}
		}
		socket.join(roomNumber)
		console.log('master conectado: ', gameSessions)
	})

	masterSocket.on('approve-name', (roomNumber, studentId, approved) => {
		const objIndex = gameSessions[roomNumber].students.findIndex(student => student.studentId === studentId)
		const studentSocketId = gameSessions[roomNumber].students[objIndex].socketId
		gameSessions[roomNumber].students[objIndex].nameApproved = approved
		if (approved) {
			io.to(studentSocketId).emit('name-approved')
		} else {
			io.to(studentSocketId).emit('name-rejected')
		}
	})
}