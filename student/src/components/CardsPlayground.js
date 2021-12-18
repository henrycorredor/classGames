import { useGameStateContext } from '../contexts/GameStateProvider'
import FastCards from './gamesPlaygraund/FastCards'

export default function CardsPlayground() {
	const { gameState } = useGameStateContext()
	const { id } = gameState.game
	switch (id) {
		case 'fastCards':
			return <FastCards />
		default:
			return <div>Algo salió mal</div>
	}
}