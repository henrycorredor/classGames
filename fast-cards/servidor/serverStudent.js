const { nanoid } = require('nanoid')

module.exports = function (io, gameSessions, waiting) {

	const studentSocket = io.of('/student')

	studentSocket.on('connection', (socket) => {
		console.log('estudiante conectado')
		let constructorRoomNumber = ''
		let constructorStudentId = ''

		socket.on('disconnect', () => {
			console.log('estudiante desconectado ' + constructorStudentId)
		})

		socket.on('join-room', (roomNumber, cb) => {
			if (!gameSessions[roomNumber]) {
				cb(false, '', 'Sala inexistente.')
			} else {
				constructorStudentId = nanoid()
				constructorRoomNumber = roomNumber
				gameSessions[constructorRoomNumber].students.push({
					name: '',
					id: constructorStudentId,
					socketId: socket.id,
					nameApproved: false,
					rol: 'student'
				})
				socket.join('room-' + roomNumber)
				cb(true, constructorStudentId, '')
			}
		})

		socket.on('register-name', (studentName) => {
			gameSessions[constructorRoomNumber].students.find(student => {
				if (student.id === constructorStudentId) {
					student.name = studentName
					return true
				}
			})
			const masterId = gameSessions[constructorRoomNumber].masterInfo.socketId
			io.of('/master').to(masterId).emit(
				'new-student-registered',
				gameSessions[constructorRoomNumber].students.filter(student => student.name !== '')
			)
		})

		socket.on('verify-room', (roomNumber, cb) => {
			console.log('estudiante verifica sala')
			const notFound = (!gameSessions[roomNumber])
			if (!notFound) {
				gameSessions[roomNumber].students.find(student => {
					if (student.id === constructorStudentId) {
						gameSessions[roomNumber].students.socketId = socket.id
					}
				})
				socket.join('room-' + roomNumber)
			}
			cb(notFound)
		})

	})
}