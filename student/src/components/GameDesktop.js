import { useGameStateContext } from '../contexts/GameStateProvider'
import Suscribe from './Suscribe'
import WaitingClassmates from './WaitingClassmates'
import CardsPlayground from './CardsPlayground'
import GameOver from './GameOver'

export default function GameDesktop() {
	const { gameState } = useGameStateContext()
	switch (gameState.user.status) {
		case 0:
			return <div className='golden-board'>Conectando ...</div>
		case 1:
			return <Suscribe />
		case 2:
			return <WaitingClassmates />
		case 3:
			return <CardsPlayground />
		case 4:
			return <GameOver />
		default:
			return <div>Oops...</div>
	}
}