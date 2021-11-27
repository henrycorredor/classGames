export default function useUpdateGameSession(setGameSession) {
	return function (newObj) {
		setGameSession(prev => {
			return ({
				game: {
					...prev.game,
					...newObj.game
				},
				students: [
					...prev.students,
					...newObj.students
				]
			})
		})
	}
}