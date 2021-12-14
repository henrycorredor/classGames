const { nanoid } = require('nanoid')

module.exports = function (io, gameSessions, gameInstances, userDropConection) {
	const studentSocket = io.of('/student')

	studentSocket.on('connect', (socket) => {

		let room = ''
		let myId = ''
		let session = ''

		function getStudent(id) {
			const student = session.students.filter(s => s.id === id)
			if (student.length !== 0) return student[0]
			const waitingStudent = session.waiting.filter(s => s.id === id)
			return (waitingStudent.length === 0) ? null : student[0]
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

		function getGameObj() {
			return (gameInstances[room]) ?
				gameInstances[room].gameObj() :
				{}
		}

		socket.on('disconnect', () => {
			if (room) {
				userDropConection(room, myId)
				io.of('/student').to(room).emit('update-students-list', studentsListToClient())
				const master = session.master.socket
				const students = session.students.map(s => {
					return {
						id: s.id,
						name: s.name,
						online: s.online,
						rol: s.rol
					}
				})
				const waiting = session.waiting.map(s => {
					return {
						id: s.id,
						name: s.name,
						socket: s.socket
					}
				})
				io.of('/master').to(master).emit('update-students', { students: students, waiting: waiting })
			}
		})

		socket.on('join-room', (roomNumber, cb) => {
			if (gameSessions['room-' + roomNumber]) {

				room = 'room-' + roomNumber
				myId = nanoid()
				session = gameSessions['room-' + roomNumber]

				session.waiting.push({
					id: myId,
					name: '',
					socket: socket.id,
					status: 2
				})
				socket.join(room)
				cb(true, myId, session.settings)
			} else {
				cb(false, 'Sala inexistente')
			}
		})

		socket.on('verify-room', (roomNumber, userId, cb) => {

			if (gameSessions['room-' + roomNumber]) {
				session = gameSessions['room-' + roomNumber]
				const student = getStudent(userId)

				if (student) {
					room = 'room-' + roomNumber
					myId = userId
					student.socket = socket.id
					student.online = true
					socket.join(room)
					cb(
						true,
						{
							game: { status: student.status },
							user: {
								name: student.name,
								rol: (student.rol) ? student.rol : 'student'
							},
							students: studentsListToClient(),
							gameObj: getGameObj()
						}
					)
				} else {
					cb(false)
				}

			} else {
				cb(false)
			}

		})

		socket.on('register-name', (studentName, cb) => {
			const student = getStudent(myId)
			student.name = studentName
			student.status = 3
			const master = session.master.socket
			io.of('/master').to(master).emit('user-provide-name', session.waiting.filter(s => s.name !== ''))
			cb(true)
		})
		
	})
}