import { useGameStateContext } from "../contexts/GameStateProvider"
import './styles/GameOver.css'

export default function GameOver() {
	const { gameState } = useGameStateContext()
	const { cardsDeck, settings } = gameState
	return (
		<div className='game-over'>
			<div className='points'> {cardsDeck.points} / <span> {settings.maxPoints} </span> </div>
			<div className="golden-board">
				¡Muy bien!
			</div>
		</div>
	)
}