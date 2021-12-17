const { nanoid } = require('nanoid')
const userDropConection = require('./sessionControl')

module.exports = function (io, rooms) {
	const studentSocket = io.of('/student')

	studentSocket.on('connect', (socket) => {

		const client = {
			game: {
				room: '',
				id: '',
				status: 0,
				settings: ''
			},
			user: {
				id: '',
				name: '',
				rol: 'student'
			},
			students: []
		}

		let room = ''
		let roomName = ''

		function studentList() {
			return room.students.map(s => {
				return {
					id: s.id,
					name: s.name,
					online: s.online,
					rol: s.rol
				}
			})
		}

		function sendClientsStudentsList() {
			const master = room.master.socket
			io.of('/master').to(master).emit('update-user-list', studentList())
			io.of('/student').to(roomName).emit('update-user-list', studentList())
		}

		function updateAndGetClientObj(newObj) {
			client.game = {
				...client.game,
				...newObj.game
			}
			client.user = {
				...client.user,
				...newObj.user
			}
			if (newObj.students) client.students = newObj.students

			return client
		}

		socket.on('disconnect', () => {
			/*if (room) {
				userDropConection(room, client.user.id)
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
			}*/
		})

		socket.on('join-room', (form, cb) => {

			if (rooms['room-' + form.roomNumber]) {
				roomName = 'room-' + form.roomNumber
				room = rooms[roomName]

				client.user.id = nanoid()

				room.students.push({
					id: client.user.id,
					name: form.userName,
					online: true,
					rol: 'student',
					socket: socket.id,
					status: 2
				})

				const newObj = {
					game: {
						room: form.roomNumber,
						status: 2,
						id: room.game.id,
						settings: room.game.settings,
					},
					students: studentList()
				}
				socket.join(roomName)
				sendClientsStudentsList()
				cb(true, updateAndGetClientObj(newObj))
			} else {
				cb(false)
			}
		})

		socket.on('verify-room', (roomNumber, userId, cb) => {
			console.log(roomNumber)
			console.log(rooms)
			if (rooms['room-' + roomNumber]) {
				roomName = 'room-' + roomNumber
				room = rooms[roomName]
				if (room.students.some(s => s.id === userId)) {
					const myObj = room.students.filter(s => s.id !== userId)
					myObj[0].online = true

					const newObj = {
						game: {
							room: roomNumber,
							id: room.game.id,
							status: room.game.status,
							settings: room.game.settings
						},
						user: {
							id: userId,
							name: myObj[0].name,
							rol: myObj[0].rol
						},
						students: studentList()
					}

					cb(true, updateAndGetClientObj(newObj))
				}
			} else {
				cb(false)
			}
		})

		socket.on('hit-card', (userId, cardIndex) => {
			console.log('miau')
			const cards = gameInstances[room]
			cards.hitCard(userId, cardIndex)
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
			io.of('/student').to(room).emit('update-cards-deck', gameInstances[room].gameObj())
		})

		socket.on('next-round', (cb) => {
			if (session.settings.teachersTakeTurns) {
				let index = session.students.findIndex(s => s.rol === 'teacher')
				index += 1
				if (index === session.students.length) index = 0
				session.students.forEach(s => s.rol = 'student')
				session.students[index].rol = 'teacher'
				io.of('/student').to(room).emit('update-students-list', studentsListToClient())
			}
			gameInstances[room].gameState = 1
			cb(gameInstances[room].setNewTurn())
			io.of('/student').to(room).emit('update-cards-deck', gameInstances[room].gameObj())
		})

	})
}