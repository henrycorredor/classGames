export default function useUpdateSession(setSession) {
	return function (newObj) {
		setSession(oldObj => {
			return ({
				...oldObj,
				...newObj
			})
		})
	}
}