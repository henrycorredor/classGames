import { useState } from 'react'
import { useSocket } from '../contexts/SocketProvider'
import { useGameContext } from '../contexts/GameSessionProvider'

export default function InputName() {
	const [studentName, setStudentName] = useState('')
	const socket = useSocket()
	const { updateGameSession, gameSession } = useGameContext()

	function handleChange(e) {
		setStudentName(e.target.value)
	}

	function handleSubmit(e) {
		e.preventDefault()
		socket.emit('register-name', studentName, () => {
			updateGameSession({ user: { name: studentName } })
		})
		setStudentName('')
	}

	if(gameSession.user.name === ''){
		return (
			<div>
					<form onSubmit={handleSubmit}>
						<label>
							Tu nombre:
							<input type='text' onChange={handleChange} value={studentName} />
						</label>
						<button>Registrar</button>
					</form>
			</div>
		)
	}else{
		return <div>Espera un momento que el profe te apruebe...</div>
	}
}