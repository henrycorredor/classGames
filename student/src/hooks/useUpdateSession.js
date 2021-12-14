export default function useUpdateSession(setGameSession) {
	return function (newObj) {
		setGameSession(prevObj => {
			newObj.students = (newObj.students) ? newObj.students : prevObj.students
			return ({
				game: {
					...prevObj.game,
					...newObj.game
				},
				user: {
					...prevObj.user,
					...newObj.user
				},
				students: [
					...newObj.students
				],
				settings: {
					...prevObj.settings,
					...newObj.settings
				},
				cardsDeck: {
					...prevObj.cardsDeck,
					...newObj.cardsDeck
				}
			})
		})
	}
}