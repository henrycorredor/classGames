import { useState } from 'react'
import { useSocket } from '../contexts/SocketProvider'

export default function Login({ updateGameSession }) {
	const [userName, setUserName] = useState('')
	const socket = useSocket()

	function nameHandleChange({ target }) {
		setUserName(target.value)
	}

	function handleSubmit(e) {
		e.preventDefault()
		updateGameSession({ name: userName, rol: 'student' }, 'user')
		updateGameSession({state: 3}, 'game')
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