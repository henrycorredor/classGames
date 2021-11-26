import { useGameSession } from "../contexts/SessionProvider";

export default function WaitingRoom() {
	const { gameSession } = useGameSession()

	if (gameSession.game.state === 3) {
		return (
			<div>
				El profe te va a aprovar, un momentito...
			</div>
		)
	} else {
		return (
			<div>
				Espere que todos los estudiantes estén listos
				<ul>
					{gameSession.classMates.map(s => <li key={s.id}> {s.name} {(s.rol === 'teacher') ? ' - el profe' : null} </li>)}
				</ul>
			</div>
		)
	}
}
