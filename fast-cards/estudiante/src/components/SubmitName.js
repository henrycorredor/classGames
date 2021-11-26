import { useState } from 'react'
import { useGameSession } from '../contexts/SessionProvider'
import { useSocket } from '../contexts/SocketProvider'

export default function SubmitName() {
	const [userName, setUserName] = useState('')
	const socket = useSocket()
	const { updateGameSession } = useGameSession()

	function nameHandleChange({ target }) {
		setUserName(target.value)
	}

	function handleSubmit(e) {
		e.preventDefault()
		updateGameSession({ user: { name: userName, rol: 'student' }, game: { state: 3 } })
		socket.emit('register-name', userName)
	}

	return (
		<form onSubmit={handleSubmit}>
			<label>
				Tu nombre:
				<input type="text" name="name" onChange={nameHandleChange} value={userName} />
			</label>
			<button type='submit'>Registrar</button>
		</form>
	)
}