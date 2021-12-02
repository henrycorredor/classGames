import { useState } from 'react'
import { useSocket } from '../contexts/SocketProvider'
import { useGameContext } from '../contexts/GameSessionProvider'

export default function InputRoomNumber() {
	const [warning, setWarning] = useState()
	const [roomNumber, setRoomNumber] = useState('')
	const { updateGameSession } = useGameContext()
	const socket = useSocket()

	function handleChange(e) {
		setRoomNumber(e.target.value)
		setWarning('')
	}

	function handleSubmit(e) {
		e.preventDefault()
		socket.emit('join-room', roomNumber, (ok, newId, newSettings) => {
			if (ok) {
				console.log('accede a la sala')
				console.log(newSettings)
				updateGameSession({
					game: { room: roomNumber, status: 3 },
					user: { id: newId },
					settings: { ...newSettings }
				})
			} else {
				setRoomNumber('')
				setWarning(newId)
			}
		})
	}

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<label>
					Número de sala: <input type='text' onChange={handleChange} value={roomNumber} />
				</label>
				<button type='submit'>Entrar</button>
			</form>
			{(warning) ? <div>{warning}</div> : null}
		</div>
	)
}