const sessionControl = require('./sessionControl')
const fastCardClass = require('./games_controler/fastCardsClass')

module.exports = function (io, rooms, fastCardsClass, userDropConection) {
	const masterSocket = io.of('/master')

	masterSocket.on('connect', (socket) => {
		console.log('master conectado')

		let room = ''
		let roomName = ''

		function getStudent(id) {
			const student = session.students.filter(s => s.id === id)
			return (student.length === 0) ? null : student[0]
		}

		function getWaitingStudent(id) {
			const student = session.waiting.filter(s => s.id === id)
			return (student.length === 0) ? null : student[0]
		}

		function studentsListToClient() {
			return room.students.map(s => {
				return {
					id: s.id,
					name: s.name,
					online: s.online,
					rol: s.rol
				}
			})
		}

		function createNewGame(game) {
			switch (game.id) {
				case 'fastCards':
					return new fastCardClass(game)
				default:
					return ''
			}
		}

		function sendClientsStudentsList(except) {
			const master = room.master.socket
			io.of('/master').to(master).emit('update-user-list', studentsListToClient())
			io.of('/student').to(roomName).except(except).emit('update-user-list', studentsListToClient())
		}

		socket.on('disconnect', () => {
			if (room) {
				//userDropConection(room, 'master')
			}
		})

		socket.on('create-room', (gameOpts, cb) => {
			//random = Math.floor(Math.random() * 90000) + 10000
			random = Math.floor(Math.random() * 90) + 10
			roomName = 'room-' + random
			rooms[roomName] = {
				master: {
					socket: socket.id,
					status: 2,
					online: true
				},
				students: [],
				game: createNewGame(gameOpts)
			}
			room = rooms[roomName]
			cb(random)
		})

		socket.on('verify-room', (roomNumber, cb) => {
			if (rooms['room-' + roomNumber]) {
				roomName = 'room-' + roomNumber
				room = rooms[roomName]

				room.master.socket = socket.id
				room.master.online = true

				cb(true, {
					room: roomNumber,
					status: room.master.status,
					users: studentsListToClient(),
					game: {
						name: room.game.name,
						id: room.game.id,
						settings: room.game.settings
					}
				})
			} else {
				cb(false)
			}
		})

		socket.on('moderate-student', (id, action) => {
			const user = room.students.filter(s => s.id === id)
			switch (action) {
				case 'reject':
					const resetUserObj = {
						game: {
							room: '',
							id: '',
							status: 1,
							settings: ''
						},
						user: {
							id: '',
							name: '',
							rol: 'student'
						},
						students: []
					}
					io.of('/student').to(user[0].socket).emit('update-game-obj', resetUserObj)
					room.students = room.students.filter(s => s.id !== id)
					break
				case 'set-teacher':
					user[0].rol = 'teacher'
					break
				default:
					break
			}
			sendClientsStudentsList()
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
					gameInstance = new fastCardsClass(settings.numberOfCardsOnBoard, io.of('/student').to(room))
					break
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