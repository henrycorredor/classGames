const { nanoid } = require('nanoid')
const userDropConection = require('./sessionControl')

module.exports = function (io, rooms) {
	const studentSocket = io.of('/student')

	studentSocket.on('connect', (socket) => {

		let room = ''
		let roomName = ''
		let myId = ''

		function studentList() {
			return room.users.list.map(s => {
				return {
					id: s.id,
					name: s.name,
					online: s.online,
					rol: s.rol
				}
			})
		}

		function emitUsersList(except) {
			const master = room.master.socket
			io.of('/master').to(master).emit('update-user-list', studentList())
			io.of('/student').to(roomName).except(except).emit('update-user-list', studentList())
		}

		socket.on('disconnect', () => {
			//handle
		})

		socket.on('join-room', (form, cb) => {

			// form = {roomNumber: Number, userName: string}

			if (rooms['room-' + form.roomNumber]) {
				roomName = 'room-' + form.roomNumber
				room = rooms[roomName]

				myId = nanoid()

				room.users.list.push({
					id: myId,
					name: form.userName,
					online: true,
					rol: 'student',
					socket: socket.id
				})

				socket.join(roomName)

				emitUsersList(socket.id)
				cb(true,
					{
						user: {
							id: myId,
							name: form.userName,
							rol: 'student',
							status: 2
						},
						users: studentList(),
						game: {
							room: form.roomNumber,
							id: room.game.id,
							name: room.game.id,
							settings: room.game.settings,
						}
					})
			} else {
				cb(false)
			}
		})

		socket.on('verify-room', (roomNumber, userId, cb) => {

			if (rooms['room-' + roomNumber]) {
				const myObj = rooms['room-' + roomNumber].users.list.filter(s => s.id === userId)
				if (myObj.length !== 0) {

					roomName = 'room-' + roomNumber
					room = rooms[roomName]

					myObj[0].online = true

					const newGameObj = {
						game: {
							room: roomNumber,
							id: room.game.id,
							status: room.game.status,
							settings: room.game.settings,
							props: room.game.props
						},
						user: {
							id: userId,
							name: myObj[0].name,
							rol: myObj[0].rol,
							status: room.users.status
						},
						students: studentList()
					}
					emitUsersList(socket.id)
					cb(true, newGameObj)
				} else {
					cb(false)
				}

			} else {
				cb(false)
			}
		})

		function reportUpdate() {
			io.of('/student').to(roomName).emit(
				'update-game-state',
				{
					user: {
						status: room.users.status
					},
					game: {
						props: room.game.getProps(),
						status: room.game.status
					},
					users: studentList()
				})
			io.of('/master').to(room.master.socket).emit('update-state', { status: room.master.status })
		}

		socket.on('action-1', (options) => {
			room.game.action1(options, room, reportUpdate)
		})

		socket.on('action-2', (options) => {
			console.log('action 2 llamada')
			room.game.action2(options, room, reportUpdate)
		})

		socket.on('action-3', (options) => {
			room.game.action3(options, room, reportUpdate)
		})

		socket.on('action-4', (options) => {
			room.game.action1(options, room, reportUpdate)
		})

	})
}