import { useGameContext } from "../contexts/GameSessionProvider"
import CardsPlayground from "./CardsPlayground"
import WaitingClassmates from "./WaitingClassmates"

export default function GameBoard() {
	const { gameSession } = useGameContext()

	switch (gameSession.game.status) {
		case 4:
			return <WaitingClassmates />
		case 5:
			return <CardsPlayground />
		case 6:
			return <div>Fin</div>
		default:
			return <div>Oops...</div>
	}
}