import { useGameContext } from "../contexts/GameSessionProvider"
import './styles/GameOver.css'

export default function GameOver() {
	const { gameSession } = useGameContext()
	const { cardsDeck, settings } = gameSession
	return (
		<div className='game-over'>
			<div className='points'> {cardsDeck.points} / <span> {settings.maxPoints} </span> </div>
			<div className="golden-board">
				¡Muy bien!
			</div>
		</div>
	)
}