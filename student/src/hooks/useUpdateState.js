export default function useUpdateState(setGameState) {
	return function (newObj) {
		setGameState(prevObj => {
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
				]
			})
		})
	}
}