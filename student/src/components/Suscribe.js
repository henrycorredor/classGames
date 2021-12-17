import { useState } from 'react'
import { useSocket } from '../contexts/SocketProvider'
import { useGameStateContext } from '../contexts/GameStateProvider'

export default function Suscribe() {
	const [warning, setWarning] = useState('')
	const [form, setForm] = useState({ roomNumber: '', userName: '' })
	const { updateGameState } = useGameStateContext()
	const socket = useSocket()

	function handleChange({ target }) {
		setForm(data => {
			return {
				...data,
				[target.name]: target.value
			}
		})
		setWarning('')
	}

	function handleSubmit(e) {
		e.preventDefault()
		socket.emit('join-room', form, (ok, gameObj) => {
			if (ok) {
				console.log(gameObj)
				updateGameState({
					...gameObj
				})
			} else {
				setForm(data => {
					return {
						...data,
						roomNumber: ''
					}
				})
				setWarning('Sala no encontrada')
			}
		})
	}

	function warningDiv() {
		const warningClass = warning ? 'warning-on' : 'warning-off'
		return <div className={`${warningClass} warning`}> {warning} </div>
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
					name='roomNumber'
					value={form.roomNumber}
				/>
				<input
					className='it3'
					placeholder='Tu nombre'
					type='text'
					onChange={handleChange}
					name='userName'
					value={form.userName}
				/>
				<button className='b3' type='submit'>Entrar</button>
			</form>
		</div>
	)
}