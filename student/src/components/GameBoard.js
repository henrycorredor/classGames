import { useGameSession } from "../contexts/GameSessionProvider"

export default function GameBoard() {
	const { gameSession } = useGameSession()

	switch (gameSession.status) {
		case 'playing':
			return <div>Conectando...</div>
		default:
			return <div className='small-board center'>Oops...</div>
	}
}