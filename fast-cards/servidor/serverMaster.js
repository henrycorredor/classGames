const { nanoid } = require('nanoid')

module.exports = function (io, gameSessions) {

	const masterSocket = io.of('/master')

	masterSocket.on('connection', (socket) => {
		const socketId = socket.id
		let constructorRoomNumber = ''

		function appovedStudentsList(){
			const toReturn = []
			const approvedClassmates = gameSessions[constructorRoomNumber].students.filter(s => s.nameApproved)
			for (let i = 0; i < approvedClassmates.length; i++) {
				toReturn.push({ name: approvedClassmates[i].name, id: approvedClassmates[i].id, rol: approvedClassmates[i].rol })
			}
			return toReturn
		}

		console.log('master conectado')

		socket.on('disconnect', () => {
			console.log('socket maestro desconectado')
		})

		socket.on('verify-room', (roomNumber, cb) => {
			const notFound = !gameSessions[roomNumber]
			if (!notFound) {
				gameSessions[roomNumber].masterInfo.socketId = socket.id
				const StudentsWithName = gameSessions[roomNumber].students.filter(student => student.name !== '')
				cb(false, StudentsWithName)
			}
			cb(notFound)
		})

		socket.on('create-room', (cb) => {
			roomNumber = Math.floor(Math.random() * 90000) + 10000
			masterId = nanoid()
			gameSessions[roomNumber] = {
				masterInfo: { id: masterId, socketId },
				students: []
			}
			cb(masterId, roomNumber, [])
			constructorRoomNumber = roomNumber
		})

		socket.on('approve-nickname', (studentId, approve, cb) => {
			const student = gameSessions[constructorRoomNumber].students.find(s => s.id === studentId)
			student.nameApproved = approve

			io.of('/student').to(student.socketId).emit('name-approved', approve)

			if (approve) {
				io.of('/student').to('room-' + constructorRoomNumber).emit('update-students-list', appovedStudentsList())
			} else {
				student.name = ''
			}

			cb(gameSessions[constructorRoomNumber].students.filter(student => student.name !== ''))
		})

		socket.on('select-teacher', (studentId, done) => {
			const student = gameSessions[constructorRoomNumber].students.find(s => s.id === studentId)
			student.rol = 'teacher'
			io.of('/student').to('room-' + constructorRoomNumber).emit('update-students-list', appovedStudentsList())
		})

		socket.on('start-game', ()=>{
			console.log('empieza el juego')
			io.of('/student').to('room-' + constructorRoomNumber).emit('start-game')
		})
	})
}