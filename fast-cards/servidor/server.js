const serverMaster = require('./serverMaster')
const serverStudent = require('./serverStudent')
const io = require("socket.io")(
	3000, {
	cors: {
		origin: ['http://localhost:3001', 'http://localhost:3002']
	}
})

const gameSessions = {}

serverMaster(io, gameSessions)
serverStudent(io, gameSessions)