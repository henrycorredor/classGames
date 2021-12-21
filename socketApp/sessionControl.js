module.exports = function (rooms) {
	return function userDropConection(roomNumber, userId) {
		if (userId === 'master') {
			rooms[roomNumber].master.online = false
		} else {
			const student = rooms[roomNumber].users.list.filter(s => s.id === userId)
			if (student[0]) student[0].online = false
		}

		const nonStudents = rooms[roomNumber].users.list.every(s => s.online === false)
		const nonMaster = !rooms[roomNumber].master.online
		if (nonStudents && nonMaster) {
			delete rooms[roomNumber]
		}
	}
}