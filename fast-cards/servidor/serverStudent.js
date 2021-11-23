const { nanoid } = require('nanoid')

module.exports = function (io, gameSessions) {

	const studentSocket = io.of('/student')

	studentSocket.on('connection', (socket) => {
		console.log(gameSessions)
		// const roomNumber = socket.handshake.query.roomNumber
		// const socketId = socket.id

		// let studentId = socket.handshake.query.id
		// let studentName = socket.handshake.query.name
		// const nameApproved = false
		// if (!studentId) {
		// 	studentId = nanoid()
		// 	socket.emit('register-student-id', studentId)
		// }

		// if (!gameSessions[roomNumber]) {
		// 	gameSessions[roomNumber] = { students: [{ studentId, socketId, studentName, nameApproved }] }
		// } else {
		// 	if (!gameSessions[roomNumber].hasOwnProperty('students')) {
		// 		gameSessions[roomNumber].students = [{ studentId, socketId, studentName, nameApproved }]
		// 	} else {
		// 		const objIndex = gameSessions[roomNumber].students.findIndex(student => student.studentId === studentId)
		// 		if (objIndex === -1) {
		// 			gameSessions[roomNumber].students.push({ studentId, socketId, studentName, nameApproved })
		// 		} else {
		// 			gameSessions[roomNumber].students[objIndex].socketId = socketId
		// 		}
		// 	}
		// }
		console.log('estudiante conectado', gameSessions)
		//socket.join(roomNumber)

		socket.on('update-name', (studentName, roomNumber) => {
			console.log(gameSessions[roomNumber])
			console.log(roomNumber)
			const objIndex = gameSessions[roomNumber].students.findIndex(student => student.studentId === studentId)
			gameSessions[roomNumber].students[objIndex].studentName = studentName
			const masterId = gameSessions[roomNumber].masterInfo.id
			console.log('estudiante envio peticion de nombre, master: ' + masterId + roomNumber)
			io.to(masterId).emit('new-name-income', { studentName, studentId })
		})
	})
}