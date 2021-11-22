const PREFIX = 'cg-fast-cards-master-'

const masterId = localStorage.getItem(PREFIX + 'id')

const params = {
	query: {
		id: (masterId) ? masterId : ''
	}
}

const socket = io(window.location + 'master', params)

socket.on('connect', () => {
	socket.on('register-master-id', (masterId) => {
		localStorage.setItem(PREFIX + 'id', masterId)
		console.log(`recibe la id ${masterId}`)
	})
})