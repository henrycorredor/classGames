import { useGameContext } from '../contexts/GameSessionProvider'
import InputRoomNumber from './InputRoomNumber'
import InputName from './InputName'
import GameBoard from './GameBoard'
import { CardsDeckProvider } from '../contexts/CardsDeckProvider'

export default function GameDesktop() {
	const { gameSession } = useGameContext()
	const { game } = gameSession
	switch (game.status) {
		case 1:
			return <div>Conectando ...</div>
		case 2:
			return <InputRoomNumber />
		case 3:
			return <InputName />
		case 4:
		case 5:
		case 6:
			return (
				<CardsDeckProvider>
					<GameBoard />
				</CardsDeckProvider>
			)
		default:
			return <div>Oops...</div>
	}
}