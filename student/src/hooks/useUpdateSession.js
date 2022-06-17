export default function useUpdateSession(setSession) {
	return function (newObj) {
		setSession(oldObj => {
			const status = !newObj.status ? oldObj.status : newObj.status
			const players = !newObj.players ? oldObj.players : newObj.players
			return ({
				myInfo: {
					...oldObj.myInfo,
					...newObj.myInfo
				},
				status: status,
				players: players,
				game: {
					...oldObj.game,
					...newObj.game
				}

			})
		})
	}
}