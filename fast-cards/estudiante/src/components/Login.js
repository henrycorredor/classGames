import { useState } from 'react'
import { useGameSession } from '../contexts/SessionProvider'

export default function Login({ teacherAprove }) {
	const [gameSession, setGameSession] = useGameSession()
	const [userForm, setUserForm] = useState({
		name: '',
		rol: 'student'
	})
	const [roomNumber, setRoomNumber] = useState('')

	function userHandleChange({ target }) {
		setUserForm(state => {
			return {
				...state,
				[target.name]: target.value
			}
		})
	}

	function roomNumberHandleChange({ target }) {
		setRoomNumber(target.value)
	}

	function handleSubmit(e) {
		e.preventDefault()
		setGameSession(original => {
			const newElement = {
				user: {
					...original.user,
					...userForm
				},
				game: {
					...original.game,
					roomNumber
				}
			}
			return {
				...original,
				...newElement
			}
		})
	}

	const InmputRoomNumber = (
		<form onSubmit={handleSubmit}>
			<label>
				Número de sala
				<input name='roomNumber' type='text' onChange={roomNumberHandleChange} value={roomNumber} />
			</label>
			<button type="submit">Entrar</button>

		</form>
	)

	const InputUserName = (
		<form onSubmit={handleSubmit}>
			<label>
				Tu nombre:
				<input type="text" name="name" onChange={userHandleChange} value={userForm.name} />
			</label>
			<button type='submit'>Entrar</button>
		</form>
	)

	return (
		gameSession.game.roomNumber === '' ? InmputRoomNumber : InputUserName
	)
}
