export default function useUpdateGameSession(setGameSession) {
	return function (updateObj) {
		updateObj.user = (!updateObj.user) ? {} : updateObj.user
		updateObj.game = (!updateObj.game) ? {} : updateObj.game
		updateObj.classMates = (!updateObj.classMates) ? [] : updateObj.classMates

		setGameSession(prevSession => {
			return {
				user: {
					...prevSession.user,
					...updateObj.user
				},
				game: {
					...prevSession.game,
					...updateObj.game
				},
				classMates: [
					...updateObj.classMates
				]
			}
		})
	}
}