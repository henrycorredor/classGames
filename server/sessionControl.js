module.exports = function (classSessions, gameInstances) {
	return function userDropConection(roomNumber, userId) {
		if (userId === 'master') {
			classSessions[roomNumber].master.online = false
		} else {
			const student = classSessions[roomNumber].students.filter(s => s.id === userId)
			const waiting = classSessions[roomNumber].waiting.filter(s => s.id === userId)
			if (student[0]) student[0].online = false
			if (waiting[0]) {
				classSessions[roomNumber].waiting = classSessions[roomNumber].waiting.filter(s => s.id !== userId)
			}
		}

		const nonStudents = classSessions[roomNumber].students.every(s => s.online === false)
		const nonMaster = !classSessions[roomNumber].master.online
		if (nonStudents && nonMaster) {
			delete classSessions[roomNumber]
			delete gameInstances[roomNumber]
		}
	}
}