export default function useUpdateGameSession(gameSession, setGameSession) {
	return function (valuesObj, objSection) {
		const userPrev = gameSession.user
		const gamePrev = gameSession.game
		const userToUpdate = (objSection === 'user') ? valuesObj : {}
		const gameToUpdate = (objSection === 'game') ? valuesObj : {}
		setGameSession(
			{
				user: {
					...userPrev,
					...userToUpdate
				},
				game: {
					...gamePrev,
					...gameToUpdate
				},
				classMates: [...gameSession.classMates]
			}
		)
	}
}