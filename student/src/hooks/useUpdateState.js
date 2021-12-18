export default function useUpdateState(setGameState) {
	return function (newObj) {
		setGameState(prevObj => {
			newObj.users = (newObj.users) ? newObj.users : prevObj.users
			return ({
				game: {
					...prevObj.game,
					...newObj.game
				},
				user: {
					...prevObj.user,
					...newObj.user
				},
				users: [
					...newObj.users
				]
			})
		})
	}
}