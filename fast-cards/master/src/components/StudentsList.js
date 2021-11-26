import { useGameSession } from "../contexts/GameSessionProvider"
import { useSocket } from "../contexts/SocketProvider"

function Ul({ studentList, socket }) {
	const { updateSession } = useGameSession()
	function approveStudent(studentId, approve) {
		socket.emit('approve-nickname', studentId, approve, ((studentsList) => {
			updateSession({ students: studentsList })
		}))
	}

	function imTeacher(teacherId) {
		socket.emit('select-teacher', teacherId)
		const newList = [...studentList]
		newList.find(s => {
			if (s.id === teacherId) {
				s.rol = 'teacher'
			}
			return true
		})
		updateSession({ students: newList })
	}

	const teacher = studentList.filter(s => s.rol === 'teacher')

	return (
		<ul>
			{(studentList.length === 0) ? <li>Esperando ...</li> : null}
			{studentList.map((s) => {
				return (
					<li key={s.id}>
						{s.name} {(s.rol === 'teacher') ? ' - el profe': null}
						{(s.nameApproved) ?
							(teacher.length === 0) ? <button onClick={() => imTeacher(s.id)}>Soy el profesor</button> : null :
							<>
								<button onClick={() => approveStudent(s.id, true)}>Aprobar</button>
								<button onClick={() => approveStudent(s.id, false)}>Rechazar</button>
								{(teacher.length === 0) ? <button onClick={() => imTeacher(s.id)}>Soy el profesor</button> : null}
							</>}
					</li>
				)
			})}
		</ul>
	)
}


export default function StudentsList() {
	const socket = useSocket()
	const { gameSession } = useGameSession()

	function startGame() {
		socket.emit('start-game')
	}

	return (
		<div>
			Inicializando, masterd id: {gameSession.masterId} <br />
			Sala número {gameSession.roomNumber} <br />
			Conectados: <br />
			<Ul studentList={gameSession.students} socket={socket} />
			<button onClick={() => startGame()}>Empezar juego</button>
		</div>)
}
