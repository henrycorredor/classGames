import { useGameSession } from "../contexts/GameSessionContext"

export default function GameBoard() {
	const { gameSession } = useGameSession()
	const { status } = gameSession.game

	switch(status){
		case 1:
			return <div>Conectando...</div>
		case 2:
			return <div>Esperando participantes...</div>
		case 3:
			return <div>Juego</div>
		case 4:
			return <div>Finalizado</div>
		default:
			return <div>Oops...</div>
	}
}