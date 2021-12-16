export default function useUpdateGameState(setGameState) {
	return function (newObj) {
		setGameState(prev => {
			return ({
				...prev,
				...newObj
			})
		})
	}
}