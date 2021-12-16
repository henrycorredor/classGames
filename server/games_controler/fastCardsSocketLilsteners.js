module.exports = async function (sockets) {
	//console.log(sockets.sockets)
	//console.log(sockets)
	/*socket.on('hit-card', (userId, cardIndex) => {
		console.log('miau')
		const cards = gameInstances[room]
		cards.hitCard(userId, cardIndex)
		if (cards.clicked.length === session.students.length - 1) {
			cards.gameState = 2
			if (cards.clicked.every(s => s.selection === cards.rightAnswer)) {
				++cards.points
				if (cards.points === Number(session.settings.maxPoints)) {
					cards.gameState = 3
					session.students.forEach(s => s.status = 6)
					session.master.status = 5
					io.of('/master').to(session.master.socket).emit('game-over')
				}
			}
		}
		io.of('/student').to(room).emit('update-cards-deck', gameInstances[room].cardDeck())
	})

	socket.on('next-round', (cb) => {
		if (session.settings.teachersTakeTurns) {
			let index = session.students.findIndex(s => s.rol === 'teacher')
			index += 1
			if (index === session.students.length) index = 0
			session.students.forEach(s => s.rol = 'student')
			session.students[index].rol = 'teacher'
			io.of('/student').to(room).emit('update-students-list', studentsListToClient())
		}
		gameInstances[room].gameState = 1
		cb(gameInstances[room].setNewTurn())
		io.of('/student').to(room).emit('update-cards-deck', gameInstances[room].cardDeck())
	})-*/
}