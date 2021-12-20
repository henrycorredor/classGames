const serverMaster = require('./serverMaster')
const serverStudent = require('./serverStudents')

module.exports = function (io) {

	const rooms = {}

	serverMaster(io, rooms)
	serverStudent(io, rooms)
}