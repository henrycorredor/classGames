import { useGameContext } from '../contexts/GameSessionProvider'
import InputRoomNumber from './InputRoomNumber'
import InputName from './InputName'
import WaitingClassmates from './WaitingClassmates'
import CardsPlayground from './CardsPlayground'
import GameOver from './GameOver'

export default function GameDesktop() {
	const { gameSession } = useGameContext()
	const { game } = gameSession
	switch (game.status) {
		case 1:
			return <div className='golden-board'>Conectando ...</div>
		case 2:
			return <InputRoomNumber />
		case 3:
			return <InputName />
		case 4:
			return <WaitingClassmates />
		case 5:
			return <CardsPlayground />
		case 6:
			return <GameOver />
		default:
			return <div>Oops...</div>
	}
}