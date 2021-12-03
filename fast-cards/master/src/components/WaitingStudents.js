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
		if (!gameSession.students.some(s => s.rol === 'teacher') && !gameSession.settings.teachersTakeTurns) {
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

	function IAmTeacherButton(id) {
		const noTeachers = gameSession.students.some(s => s.rol === 'teacher')
		return (!gameSession.settings.teachersTakeTurns && !noTeachers)
			? <button onClick={() => { imTeacher(id) }}>Soy profesor</button>
			: ''
	}

	return (
		<div className='master-main-room'>
			<div className='small-board'>{gameSession.room}</div>
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
							{IAmTeacherButton(s.id)}
						</li>
					)
				})}
			</ul>
			<button onClick={startGame}>Empezar juego</button>
			{(warning !== '') && <div>{warning}</div>}
		</div>
	)
}