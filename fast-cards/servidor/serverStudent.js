const { nanoid } = require('nanoid')

module.exports = function (io, gameSessions) {

	const studentSocket = io.of('/student')

	studentSocket.on('connection', (socket) => {
		console.log('estudiante conectado')
		let constructorRoomNumber = ''
		let constructorstudentId = ''

		socket.on('verify-room', (roomNumber, cb) => {
			console.log('verificar sala')
			console.log(gameSessions[roomNumber], !gameSessions[roomNumber])
			cb(!gameSessions[roomNumber])
		})

		socket.on('join-room', (roomNumber, cb) => {
			console.log('constructorRoomNumber', constructorRoomNumber)
			if (!gameSessions[roomNumber]) {
				cb(false, 'Sala inexistente')
			} else {
				cb(true)
				socket.join(roomNumber)
				constructorRoomNumber = roomNumber
			}
		})

		socket.on('register-name', (studentName) => {
			gameSessions[constructorRoomNumber].students.push({
				name: studentName,
				id: constructorstudentId,
				nameApproved: false,
				rol: 'student'
			})
			const masterId = gameSessions[constructorRoomNumber].masterInfo.socketId
			io.of('/master').to(masterId).emit('new-student-registered', gameSessions[constructorRoomNumber].students)
		})
	})
}