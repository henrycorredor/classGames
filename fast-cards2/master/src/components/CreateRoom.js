import { useState } from "react"
import { useGameSession } from "../contexts/GameSessionProvider"
import { useSocket } from "../contexts/SocketProvider"

export default function CreateRoom() {
	const socket = useSocket()
	const { gameSession, updateGameSession } = useGameSession()
	const [form, setForm] = useState(gameSession.settings)

	function createRoom() {
		gameSession.settings = form
		console.log(form)
		console.log(gameSession.settings)
		socket.emit('create-room', form, (roomNumber) => {
			updateGameSession({ room: roomNumber, status: 3 })
		})
	}

	function handelChange({ target }) {
		setForm(val => {
			return {
				...val,
				[target.name]: target.type === 'checkbox' ? target.checked : target.value
			}
		})
	}

	return (
		<div>
			<button onClick={createRoom}>Crear sala</button>
			<form>
				<div>
					<label>Mostrar nombres
						<input onChange={handelChange} type="checkbox" name="showStudentsName" checked={form.showStudentsName} />
					</label>
				</div>
				<div>
					<label>Puntos para ganar
						<input onChange={handelChange} type="text" name="maxPoints" value={form.maxPoints} />
					</label>
				</div>
				<div>
					<label>Mostrar la selección de los estudiantes
						<input onChange={handelChange} type="checkbox" name='showStudentChoises' checked={form.showStudentChoises} />
					</label>
				</div>
				<div>
					<label>Tomar turnos para ser profesor
						<input onChange={handelChange} type="checkbox" name='teachersTakeTurns' checked={form.teachersTakeTurns} />
					</label>
				</div>
				<div>
					<label>Mostrar el primero de cada turno
						<input onChange={handelChange} type="checkbox" name='showWhoIsFirst' checked={form.showWhoIsFirst} />
					</label>
				</div>
				<div>
					<label>Límite de tiempo
						<input onChange={handelChange} type="text" name='timeLimit' vale={form.timeLimit} />
					</label>
				</div>
			</form>
		</div>
	)
}