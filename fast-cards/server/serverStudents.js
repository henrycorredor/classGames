const { nanoid } = require('nanoid')

module.exports = function (io, gameSessions, gameInstances, userDropConection) {
	const studentSocket = io.of('/student')

	studentSocket.on('connect', (socket) => {
		console.log('estudiante conectado')

		let room = ''
		let myId = ''
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

		function getCardsDeck() {
			return (gameInstances[room]) ?
				gameInstances[room].cardDeck() :
				{
					fullDeck: [],
					randomSelection: [],
					rightAnswer: 0,
					clicked: [],
					points: 0
				}
		}

		socket.on('disconnect', () => {
			console.log('estudiante desconectado')
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
			console.log('estudiante entra a sala')
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
			console.log('estudiante verfica sala')

			if (gameSessions['room-' + roomNumber]) {
				session = gameSessions['room-' + roomNumber]
				const student = getStudent(userId)
				const waiting = getWaitingStudent(userId)

				if (student || waiting) {
					room = 'room-' + roomNumber
					myId = userId
					if (student) {
						student.socket = socket.id
						student.online = true
					} else {
						waiting.socket = socket.id
					}
					socket.join(room)
					cb(
						true,
						{
							game: { status: (student) ? student.status : waiting.status },
							user: {
								name: (student) ? student.name : waiting.name,
								rol: (student) ? student.rol : 'student',
							},
							students: studentsListToClient(),
							cardsDeck: getCardsDeck()
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
			const student = getWaitingStudent(myId)
			student.name = studentName
			student.status = 3
			const master = session.master.socket
			io.of('/master').to(master).emit('user-provide-name', session.waiting.filter(s => s.name !== ''))
			cb(true)
		})

		socket.on('hit-card', (userId, cardIndex) => {
			const cards = gameInstances[room]
			cards.hitCard(userId, cardIndex)
			console.log('puntos para ganar', session.settings.maxPoints)
			if (cards.clicked.length === session.students.length - 1) {
				cards.gameState = 2
				if (cards.clicked.every(s => s.selection === cards.rightAnswer)) {
					++cards.points
					if (cards.points === Number(session.settings.maxPoints)) {
						cards.gameState = 3
						session.students.forEach(s => s.status = 6)
						session.master.status = 5
						io.of('/master').to(session.master.socket).emit('game-over')
					}
				}
			}
			io.of('/student').to(room).emit('update-cards-deck', gameInstances[room].cardDeck())
		})

		socket.on('next-round', (cb) => {
			if (session.settings.teachersTakeTurns) {
				console.log('se asigna un profesor')
				let index = session.students.findIndex(s => s.rol === 'teacher')
				index += 1
				if (index === session.students.length) index = 0
				session.students.forEach(s => s.rol = 'student')
				session.students[index].rol = 'teacher'
				io.of('/student').to(room).emit('update-students-list', studentsListToClient())
			}
			gameInstances[room].gameState = 1
			cb(gameInstances[room].setNewTurn())
			io.of('/student').to(room).emit('update-cards-deck', gameInstances[room].cardDeck())
		})
	})
}