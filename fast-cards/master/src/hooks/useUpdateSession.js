export default function useUpdateSession(setGameSession) {
	return function (obj) {
		setGameSession(oldObj => {
			return {
				...oldObj,
				...obj
			}
		})
	}
}