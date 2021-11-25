export default function StudentsList({ gameSession }) {
	return (
		<div>
			Inicializando, masterd id: {gameSession.masterId} <br />
			Sala número {gameSession.roomNumber} <br />
			Conectados: <br />
			<ul>
				{(gameSession.students.length === 0) ? <li>En proceso...</li> : null}
				{gameSession.students.map(student => (
					<li key={student.id}>{student.name} - {student.nameApproved.toString()}</li>
				))}
			</ul>
		</div>)
}
