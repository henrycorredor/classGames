import { useGameSession } from "../contexts/SessionProvider";

export default function WaitingRoom({ teacherAprove, teacherStats }) {
	const [gameSession] = useGameSession()
	if (!gameSession.user.nameApproved) {
		return (
			<div>
				El profe te va a aprovar, un momentito
				<button type='submit' onClick={() => teacherAprove(true)}>Entrar</button>
			</div>
		)
	} else {
		return (
			<div>
				Espere que todos los estudiantes estén listos
				<button type='submit' onClick={teacherStats}> Entrar </button>
			</div>
		)
	}
}
