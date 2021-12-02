import { useState } from 'react'
import { useSocket } from '../contexts/SocketProvider'
import { useGameContext } from '../contexts/GameSessionProvider'
import './styles/InputName.css'

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
			<div className='col-4 text-center'>
				<form onSubmit={handleSubmit}>
					<input
						className='form-control text-center'
						type='text'
						placeholder='Tu nombre'
						autoFocus
						onChange={handleChange}
						value={studentName}
					/>
					<button
						className='waitinglist-name'
						type='submit'
					>Registrar</button>
				</form>
			</div>
		)
	} else {
		return (
			<div>
				<p className="text-center"><strong>Espera un momento que el profe te apruebe...</strong></p>
			</div>
		)
	}
}