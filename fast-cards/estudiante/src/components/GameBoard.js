import { useGameSession } from '../contexts/SessionProvider'
import { CardsBoardProvider } from '../contexts/CardsGameProvider'
import SubmitName from './SubmitName'
import WaitingRoom from './WaitingRoom'
import CardsBoard from './CardsBoard'
import EnterRoom from './EnterRoom'

/**
States:
0 - Waiting for connect the socket
				- socket connected
1- Socket connected, Input room number
				- submit room number
2 - Confirmated room, input name
				- submit name
3 - Name submited, waiting for teacher approval
				- teacher approved
4 - Approved, wait for teacher to start
				- game started
5 - Game
*/
export default function GameBoard() {
	const { gameSession } = useGameSession()
	const { game } = gameSession

	let imprimirEsto

	switch (game.state) {
		case 0:
			imprimirEsto = (<div>Conectando ...</div>)
			break
		case 1:
			imprimirEsto = <EnterRoom />
			break
		case 2:
			imprimirEsto = <SubmitName />
			break
		case 3:
		case 4:
			imprimirEsto = <WaitingRoom />
			break
		case 5:
		case 6:
			imprimirEsto = (
				<CardsBoardProvider>
					<CardsBoard />
				</CardsBoardProvider>
			)
			break
		case 7:
			imprimirEsto = (<div>Game over!</div>)
			break
		default:
			imprimirEsto = (<div>oops... algo salió mal</div>)
			break
	}

	return <div>
		<div>Estado {game.state}</div>
		<div>{imprimirEsto}</div>
	</div>
}
