import { useState } from 'react'
import { useSocket } from '../contexts/SocketProvider'
import { useGameContext } from '../contexts/GameSessionProvider'
import './styles/InputRoomNumber.css'

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

	function warningDiv(){
		const warningClass = warning ? 'warning-on' : 'warning-off'
		return <div className={warningClass}> {(warning) ? {warning} : 'nalgas'} </div>
	}

	return (
		<div className='one-input-form'>
			{warningDiv()}
			<form onSubmit={handleSubmit}>
				<input
					className='it3'
					placeholder='Número de sala'
					autoFocus
					type='text'
					onChange={handleChange}
					value={roomNumber}
				/>
				<button className='b3' type='submit'>Entrar</button>
			</form>
		</div>
	)
}