export default function useUpdateGameSession(setGameSession) {
	return function (newObj) {
		setGameSession(prev => {
			return ({
				...prev,
				...newObj
			})
		})
	}
}