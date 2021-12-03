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

	if (gameSession.user.name === '') {
		return (
			<div className='one-input-form'>
				<form onSubmit={handleSubmit}>
					<input
						className='it3'
						type='text'
						placeholder='Tu nombre'
						autoFocus
						onChange={handleChange}
						value={studentName}
					/>
					<button
						className='b3'
						type='submit'
					>Registrar</button>
				</form>
			</div>
		)
	} else {
		return (
			<div className='golden-board'>
				<p><strong>Espera un momento que el profe te apruebe...</strong></p>
			</div>
		)
	}
}