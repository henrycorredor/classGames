import { useGameStateContext } from "../contexts/GameStateProvider"
import './styles/GameOver.css'

export default function GameOver() {
	const { gameState } = useGameStateContext()
	const { props, settings } = gameState.game
	return (
		<div className='game-over'>
			<div className='points'> {props.points} / <span> {settings.maxPoints} </span> </div>
			<div className="golden-board">
				¡Muy bien!
			</div>
		</div>
	)
}