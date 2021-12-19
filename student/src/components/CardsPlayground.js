import { useGameStateContext } from '../contexts/GameStateProvider'
import FastCards from './gamesPlaygraund/FastCards'
import MemorySnake from './gamesPlaygraund/MemorySnake'

export default function CardsPlayground() {
	const { gameState } = useGameStateContext()
	const { id } = gameState.game
	switch (id) {
		case 'fastCards':
			return <FastCards />
		case 'memorySnake':
			return <MemorySnake />
		default:
			return <div>Algo salió mal</div>
	}
}