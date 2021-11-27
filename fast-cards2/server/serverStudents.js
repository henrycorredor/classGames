const { nanoid } = require('nanoid')

module.exports = function (io, gameSessions) {
	const studentSocket = io.of('/student')

	studentSocket.on('connect', (socket) => {
		console.log('estudiante conectado')

		let instanceRoomNumber = ''
		let myId = ''

		socket.on('disconnect', () => {
			console.log('estudiante desconectado')
		})

		function getStudentById(id) {
			const student = gameSessions['room' + instanceRoomNumber].students.filter(s => s.id === id)
			return (student.length === 0) ? null : student[0]
		}

		function getApprovedStudentsList() {
			return gameSessions['room' + instanceRoomNumber].students.filter(s => s.approved)
		}

		socket.on('verify-room', (roomNumber, userId, cb) => {
			console.log('estudiante verfica sala')
			instanceRoomNumber = roomNumber
			myId = userId
			if (gameSessions['room' + roomNumber]) {
				const student = getStudentById(userId)
				student.socket = socket.id
				cb({
					game: { status: student.status },
					user: {
						name: student.name,
						rol: student.rol
					},
					students: getApprovedStudentsList()
				})
				socket.join('room' + roomNumber)
			} else {
				cb(false)
			}
		})

		socket.on('join-room', (roomNumber, cb) => {
			if (gameSessions['room' + roomNumber]) {
				console.log('usuario ingresa a sala')
				instanceRoomNumber = roomNumber
				myId = nanoid()
				gameSessions['room' + roomNumber].students.push({
					id: myId,
					name: '',
					socket: socket.id,
					online: true,
					approved: false,
					rol: 'student',
					status: 3
				})
				cb(true, myId)
				socket.join('room' + roomNumber)
			} else {
				console.log('sala inexistente')
				cb(false, '', 'Sala inexistente')
			}
		})

		socket.on('register-name', (studentName, cb) => {
			const student = getStudentById(myId)
			student.name = studentName
			const masterSocket = gameSessions['room' + instanceRoomNumber].master.socket
			const namedStudentsList = gameSessions['room' + instanceRoomNumber].students.filter(s => s.name != '')
			io.of('/master').to(masterSocket).emit(
				'user-provide-name',
				namedStudentsList.map(s => {
					return {
						id: s.id,
						name: s.name,
						online: s.online,
						rol: s.rol,
						approved: s.approved
					}
				})
			)
			cb()
		})
	})
}


/*{
	game:{
		room: 28736,
		status: 1
	},
	user: {
		id: string,
		name: string,
		rol: 'student'
	},
	students: [
		id: string,
		name: string,
		online: true,
		rol: 'student'
	]
}*/