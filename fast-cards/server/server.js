const serverMaster = require('./serverMaster')
const serverStudent = require('./serverStudents')
const gameControlClass = require('./gameControlsClass')
const io = require('socket.io')(
	3000, {
	cors: {
		origin: ['http://localhost:3001', 'http://localhost:3002', 'http://192.168.11.184:3002']
	}
})

const gameSessions = {}
const gameInstances = {}

serverMaster(io, gameSessions, gameInstances, gameControlClass)
serverStudent(io, gameSessions, gameInstances)
