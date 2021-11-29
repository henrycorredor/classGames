const { nanoid } = require('nanoid')

module.exports = function (io, gameSessions, gameInstances) {
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
					socket: socket.id
				})
				socket.join(room)
				cb(true, myId)
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
					} else {
						waiting.socket = socket.id
					}
					socket.join(room)
					cb(
						true,
						{
							game: { status: (student) ? student.status : (waiting.name === '') ? 3 : 4 },
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
			const master = session.master.socket
			io.of('/master').to(master).emit('user-provide-name', session.waiting.filter(s => s.name !== ''))
			cb(true)
		})

		socket.on('hit-card', (userId, cardIndex) => {
			const cards = gameInstances[room]
			cards.hitCard(userId, cardIndex)
			if (cards.clicked.length === session.students.length - 1) {
				if (cards.clicked.every(s => s.selection === cards.rightAnswer)) {
					++cards.points
				}
			}
			io.of('/student').to(room).emit('update-cards-deck', gameInstances[room].cardDeck())
		})

		socket.on('next-round', (cb) => {
			cb(gameInstances[room].setNewTurn())
			io.of('/student').to(room).emit('update-cards-deck', gameInstances[room].cardDeck())
		})
	})
}