module.exports = function (io, gameSessions, gameInstances, fastCardsClass, userDropConection) {
	const masterSocket = io.of('/master')

	masterSocket.on('connect', (socket) => {
		console.log('master conectado')

		let room = ''
		let session = ''

		function getStudent(id) {
			const student = session.students.filter(s => s.id === id)
			return (student.length === 0) ? null : student[0]
		}

		function getWaitingStudent(id) {
			const student = session.waiting.filter(s => s.id === id)
			return (student.length === 0) ? null : student[0]
		}

		function studentsListToClient() {
			return session.students.map(s => {
				return {
					id: s.id,
					name: s.name,
					online: s.online,
					rol: s.rol
				}
			})
		}

		socket.on('disconnect', () => {
			if (room) {
				userDropConection(room, 'master')
			}
		})

		socket.on('create-room', (gameName, settings, cb) => {
			//roomNumber = Math.floor(Math.random() * 90000) + 10000
			roomNumber = Math.floor(Math.random() * 90) + 10
			room = 'room-' + roomNumber
			gameSessions[room] = {
				game: gameName,
				master: {
					socket: socket.id,
					status: 3,
					online: true
				},
				waiting: [],
				students: [],
				settings: settings
			}
			session = gameSessions[room]
			cb(roomNumber)
		})

		socket.on('verify-sesion', (roomNumber, cb) => {
			console.log('master verifica sala')
			if (gameSessions['room-' + roomNumber]) {
				room = 'room-' + roomNumber
				session = gameSessions['room-' + roomNumber]
				session.master.socket = socket.id
				session.master.online = true
				cb(true,
					{
						status: session.master.status,
						students: studentsListToClient(),
						waiting: session.waiting.filter(s => s.name !== '')
					})
			} else {
				cb(false)
			}
		})

		socket.on('approve-student', (studentId, approve, cb) => {
			const student = getWaitingStudent(studentId)
			if (student) {
				if (approve) {
					session.students.push({
						...student,
						online: true,
						rol: 'student',
						status: 4
					})
					session.waiting = session.waiting.filter(s => s.id !== studentId)
					io.of('/student').to(room).emit('update-students-list', studentsListToClient())
				} else {
					student.name = ''
				}
				io.of('/student').to(student.socket).emit('name-approved', approve)
				cb(true, session.waiting.filter(s => s.name !== ''), studentsListToClient())
			} else {
				cb(false)
			}
		})

		socket.on('set-teachet', (id, cb) => {
			const student = getStudent(id)
			if (student) {
				student.rol = 'teacher'
				cb(true, studentsListToClient())
				io.of('/student').to(room).emit('update-students-list', studentsListToClient())
			} else {
				cb(false)
			}
		})

		socket.on('start-game', (settings, cb) => {
			if (settings !== '') {
				session.settings = { ...settings }
			}
			if (session.settings.teachersTakeTurns) {
				let index = session.students.findIndex(s => s.rol === 'teacher')
				index += 1
				if (index === session.students.length) index = 0
				session.students.forEach(s => s.rol = 'student')
				session.students[index].rol = 'teacher'
				io.of('/student').to(room).emit('update-students-list', studentsListToClient())
			}
			session.master.status = 4
			session.students.map(s => { s.status = 5 })

			let gameInstance
			switch (session.game) {
				case 'fast-cards':
					gameInstance = new fastCardsClass(settings.numberOfCardsOnBoard)
				default:
					gameInstance = ''
			}

			gameInstances[room] = gameInstance
			io.of('/student').to(room).emit(
				'start-game', gameInstance.setNewTurn(), session.settings
			)
			cb()
		})

		socket.on('print', () => {
			console.log('miau')
		})
	})
}