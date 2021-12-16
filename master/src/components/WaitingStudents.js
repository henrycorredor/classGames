import { useState } from "react"
import { useGameState } from "../contexts/GameStateProvider"
import { useSocket } from "../contexts/SocketProvider"

export default function WaitingStudents() {
	const { gameState, updateGameState } = useGameState()
	const socket = useSocket()
	const [warning, setWarning] = useState('')

	function rejectStudent(id) {
		socket.emit('moderate-student', id, 'reject')
	}

	function setTeacher(id) {
		socket.emit('moderate-student', id, 'set-teacher')
	}

	function startGame() {
		if (!gameState.users.some(s => s.rol === 'teacher') && gameState.settings.needTeacher) {
			setWarning('No has seleccionado profesor')
		} else if (gameState.users.length < 2) {
			setWarning('Necesitamos mínimo de dos estudiantes estudiante')
		} else {
			socket.emit('start-game', gameState.game.settings, () => {
				updateGameState({ status: 3 })
			})
		}
	}

	function controlButtons(id, rol) {
		let toReturn = ''
		if (gameState.settings.needTeacher) {
			if (!gameState.users.some(u => u.rol === 'teacher') && rol !== 'teacher') {
				toReturn += <button onClick={() => setTeacher(id)}>Soy el profe</button>
			}
		}
		toReturn += <button onClick={() => rejectStudent(id)}>Expulsar</button>
		return toReturn
	}

	return (
		<div className='master-main-room'>
			<div className='small-board'>{gameState.room}</div>

			<div className='long-board'>Esperando participantes...</div>

			<ul className='long-board'>
				{gameState.users.map(s => {
					return (
						<li key={s.id}>
							{s.name}
							{controlButtons(s.id, s.rol)}
						</li>
					)
				})}
			</ul>
			{(warning !== '') && <div className='long-board'>{warning}</div>}
			<button className='b3' onClick={startGame}>Comenzar</button>
		</div>
	)
}