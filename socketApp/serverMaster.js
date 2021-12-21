const sessionControl = require('./sessionControl')
const gamesLibrary = require('./gamesLibrary')

module.exports = function (io, rooms) {
	const masterSocket = io.of('/master')
	const dropConnection = sessionControl(rooms)

	masterSocket.on('connect', (socket) => {
		console.log('master conectado')

		let room = ''
		let roomName = ''

		function usersListArr() {
			return room.users.list.map(s => {
				return {
					id: s.id,
					name: s.name,
					online: s.online,
					rol: s.rol
				}
			})
		}

		function createNewGame(game) {
			const gameClass = gamesLibrary[game.id]
			return new gameClass(game)
		}

		function emitUsersList(except) {
			console.log('avisa')
			const master = room.master.socket
			io.of('/master').to(master).emit('update-user-list', usersListArr())
			if (except) {
				io.of('/student').to(roomName).except(except).emit('update-user-list', usersListArr())
			} else {
				io.of('/student').to(roomName).emit('update-user-list', usersListArr())
			}
		}

		socket.on('disconnect', () => {
			if (room !== '') {
				dropConnection(roomName, 'master')
			}
		})

		socket.on('create-room', (gameOpts, cb) => {
			random = Math.floor(Math.random() * 900) + 100
			roomName = 'room-' + random
			rooms[roomName] = {
				master: {
					socket: socket.id,
					status: 2,
					online: true
				},
				users: {
					status: 2,
					list: []
				},
				game: {
					id: gameOpts.id,
					name: gameOpts.name,
					settings: gameOpts.settings
				}
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
					users: usersListArr(),
					game: {
						name: room.game.name,
						id: room.game.id,
						status: room.game.status,
						settings: room.game.settings
					}
				})
			} else {
				cb(false)
			}
		})

		socket.on('moderate-student', (id, action) => {
			const user = room.users.list.filter(s => s.id === id)
			switch (action) {
				case 'reject':
					const resetUserObj = {
						id: '',
						name: '',
						rol: 'student',
						status: 1
					}
					io.of('/student').to(user[0].socket).emit('update-user', resetUserObj)
					room.users.list = room.users.list.filter(s => s.id !== id)
					break
				case 'set-teacher':
					user[0].rol = 'teacher'
					break
				default:
					break
			}
			emitUsersList()
		})

		socket.on('start-game', (gameOb, cb) => {
			if (room.game) delete room.game

			room.game = createNewGame(gameOb)

			room.game.action2('', room, () => {
				room.users.status = 3
				io.of('/student').to(roomName).emit(
					'update-game-state',
					{
						user: { status: 3 },
						game: {
							id: room.game.id,
							name: room.game.name,
							props: room.game.getProps(),
							status: 1,
							settings: room.game.settings
						},
						users: usersListArr()
					}
				)
			})

			cb()
		})

		socket.on('print', () => {
			console.log(rooms)
		})
	})
}