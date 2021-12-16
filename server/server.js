const serverMaster = require('./serverMaster')
const serverStudent = require('./serverStudents')
const fastCardsClass = require('./games_controler/fastCardsClass')
const sessionControl = require('./sessionControl')
const io = require('socket.io')(
	3000, {
	cors: {
		origin: [
			'http://localhost:3001',
			'http://localhost:3002',
			'http://192.168.1.7:3001',
			'http://192.168.1.7:3002'
		]
	}
})

const gameSessions = {}
const gameInstances = {}

serverMaster(io, gameSessions, gameInstances, fastCardsClass, sessionControl(gameSessions, gameInstances))
serverStudent(io, gameSessions, gameInstances, sessionControl(gameSessions, gameInstances))
