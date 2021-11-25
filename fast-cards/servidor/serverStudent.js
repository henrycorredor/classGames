const { nanoid } = require('nanoid')

module.exports = function (io, gameSessions) {

	const studentSocket = io.of('/student')

	studentSocket.on('connection', (socket) => {
		console.log('estudiante conectado')
		let constructorRoomNumber = ''
		let constructorstudentId = ''

		socket.on('disconnect', () => {
			console.log('socket de estudiante desconectado ', socket.id)
		})

		socket.on('verify-room', (roomNumber, cb) => {
			console.log('estudiante verifica sala')
			cb(!gameSessions[roomNumber])
		})

		socket.on('join-room', (roomNumber, cb) => {
			console.log('constructorRoomNumber', constructorRoomNumber)
			console.log('sala previa', (!gameSessions[roomNumber]))
			console.log(gameSessions[roomNumber])
			if (!gameSessions[roomNumber]) {
				cb(false, 'Sala inexistente.')
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