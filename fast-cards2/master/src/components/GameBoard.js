import { useGameSession } from "../contexts/GameSessionProvider"
import CreateRoom from "./CreateRoom"
import WaitingStudents from "./WaitingStudents"

export default function GameBoard() {
	const { gameSession } = useGameSession()

	switch (gameSession.status) {
		case 1:
			return <div>Conectando...</div>
		case 2:
			return <CreateRoom />
		case 3:
			return <WaitingStudents />
		case 4:
			return <div>Jugando</div>
		case 5:
			return <div>Finalizado</div>
		default:
			return <div>Oops...</div>
	}
}