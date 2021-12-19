const serverMaster = require('./serverMaster')
const serverStudent = require('./serverStudents')
const io = require('socket.io')(
	3000, {
	cors: {
		origin: [
			'http://localhost:3001',
			'http://localhost:3002',
			'http://localhost:3001/student/',
			'http://localhost:3001/master/'
		]
	}
})

const rooms = {}

serverMaster(io, rooms)
serverStudent(io, rooms)
