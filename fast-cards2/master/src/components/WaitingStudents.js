import { useState } from "react"
import { useGameSession } from "../contexts/GameSessionProvider"
import { useSocket } from "../contexts/SocketProvider"

export default function WaitingStudents() {
	const { gameSession, updateGameSession } = useGameSession()
	const socket = useSocket()
	const [warning, setWarning] = useState('')

	function approve(id, approved) {
		setWarning('')
		socket.emit('approve-student', id, approved, (done, [waitingList, studentsList]) => {
			if (done) {
				updateGameSession({
					students: studentsList,
					waiting: waitingList
				})
			} else {
				setWarning('Oops... algo salió mal')
			}
		})
	}

	function imTeacher(id) {
		setWarning('')
		socket.emit('set-teachet', id, (done, studentList) => {
			if (done) {
				updateGameSession({ students: studentList })
			} else {
				setWarning('Oops... algo salió mal')
			}
		})
	}

	function startGame() {
		if (!gameSession.students.some(s => s.rol === 'teacher')) {
			setWarning('No has seleccionado profesor')
		} else if (gameSession.students.length < 2) {
			setWarning('Necesitamos mínimo un profesor y un estudiante')
		} else if (gameSession.waiting.length !== 0) {
			setWarning('Hay usuarios por aprovar')
		} else {
			socket.emit('start-game', () => {
				updateGameSession({ status: 4 })
			})
		}
	}

	return (
		<div>
			<h1>{gameSession.room}</h1>
			Esperando participantes...

			<ul>
				{gameSession.waiting.map(s => {
					return (
						<li key={s.id}>
							{s.name}
							<button onClick={() => { approve(s.id, true) }}>Aceptar</button>
							<button onClick={() => { approve(s.id, false) }}>Rechazar</button>
						</li>
					)
				})}
			</ul>
			<ul>
				{gameSession.students.map(s => {
					return (
						<li key={s.id}>
							{s.name}
							{(s.rol === 'teacher') ? ' - soy profe' : null}
							{(gameSession.students.some(s => s.rol === 'teacher')) ?
								null :
								<button onClick={() => { imTeacher(s.id) }}>Soy profesor</button>
							}
						</li>
					)
				})}
			</ul>
			<button onClick={startGame}>Empezar juego</button>
			{(warning !== '') && <div>{warning}</div>}
		</div>
	)
}