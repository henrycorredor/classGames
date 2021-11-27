module.exports = function (io, gameSessions, gameInstances, gameControlClass) {
	const masterSocket = io.of('/master')

	masterSocket.on('connect', (socket) => {
		console.log('master conectado')

		let instanceRoomNumber = ''

		function getClientStudentList(onlyApproved = false) {
			if (gameSessions['room' + instanceRoomNumber]) {
				const fullList = gameSessions['room' + instanceRoomNumber].students.map(s => {
					return {
						id: s.id,
						name: s.name,
						online: s.online,
						rol: s.rol,
						approved: s.approved
					}
				})
				if (onlyApproved) {
					return fullList.filter(s => s.approved)
				} else {
					return fullList.filter(s => s.name !== '')
				}
			} else {
				return null
			}
		}

		function getStudentClientStudentList() {
			const list = getClientStudentList()
			return list.map(s => {
				return {
					id: s.id,
					name: s.name,
					online: s.online,
					rol: s.rol
				}
			})
		}

		function getStudentById(id) {
			const student = gameSessions['room' + instanceRoomNumber].students.filter(s => s.id === id)
			if (student.length === 0) {
				return null
			} else {
				return student[0]
			}
		}

		socket.on('disconnect', () => {
			console.log('master desconectado')
		})

		socket.on('verify-sesion', (roomNumber, cb) => {
			console.log('master verifica sala')
			instanceRoomNumber = roomNumber
			if (gameSessions['room' + roomNumber]) {
				gameSessions['room' + roomNumber].master.socket = socket.id
				cb({
					status: gameSessions['room' + roomNumber].master.status,
					students: getClientStudentList()
				})
			} else {
				cb(false)
			}
		})

		socket.on('create-room', (cb) => {
			console.log('crea sala')
			instanceRoomNumber = Math.floor(Math.random() * 90000) + 10000
			gameSessions['room' + instanceRoomNumber] = {
				master: {
					socket: socket.id,
					status: 3
				},
				students: []
			}
			cb(instanceRoomNumber)
		})

		socket.on('approve-student', (id, approve, cb) => {
			const student = getStudentById(id)
			if (student) {
				if (!approve) {
					student.name = ''
				} else {
					student.status = 4
				}
				student.approved = approve
			}
			cb({ students: getClientStudentList() })
			io.of('/student').to(student.socket).emit('name-approved', approve)
			if (approve) {
				io.of('/student').to('room' + instanceRoomNumber).emit('update-students-list', getStudentClientStudentList())
			}
		})

		socket.on('set-teachet', (id, cb) => {
			const student = getStudentById(id)
			if (student) student.rol = 'teacher'
			cb({ students: getClientStudentList() })
			io.of('/student').to('room' + instanceRoomNumber).emit('update-students-list', getStudentClientStudentList())
		})

		socket.on('start-game', () => {
			const deckInstance = new gameControlClass()
			gameInstances[instanceRoomNumber] = deckInstance
			io.of('/student').to('room' + instanceRoomNumber).emit(
				'start-game', deckInstance.setNewTurn()
			)
		})
	})
}

/*
server obj
{
	master: {
		socket: string,
		status: 1
	},
	students:[
		{
			id: string,
			name: string,
			socket: string,
			online: true,
			approved: true,
			rol: 'student'
			status: 1
		}
	]
}

master obj
{
	room: 28736,
	status: 1,
	students: [
		id: string,
		name: string,
		online: true,
		rol: 'student',
		approved: false
	]
}

socket.emit('verify-sesion', gameSession.room, (actualSession) => {}*/