import { useGameSession } from '../contexts/SessionProvider'
import { CardsBoardProvider } from '../contexts/CardsGameProvider'
import SubmitName from './SubmitName'
import WaitingRoom from './WaitingRoom'
import CardsBoard from './CardsBoard'
import EnterRoom from './EnterRoom'

/* Game states:

1- If player didn't scanned the QR code, player needs to input manually room number.
			- User input code and hit 'Listo'
2- Input name
			- User input name and hit 'Listo'
3- User waits for teacher approval
			- Server sends a 'ok' sign
4- User waits for all players are ready
			- Teacher hit 'Empezar juego'
5- Tutorial is shown
			- Tutorial ends when the first round is done
6- Cards Play
			- Get max points
7- Game over
			- Again - go to 
*/
export default function GameBoard() {
	const [gameSession, updateGameSession] = useGameSession()
	const { game } = gameSession

	let imprimirEsto

	switch (game.state) {
		case 0:
			imprimirEsto = (<div>Conectando ...</div>)
			break
		case 1:
			imprimirEsto = <EnterRoom updateGameSession={updateGameSession} />
			break
		case 2:
			imprimirEsto = <SubmitName updateGameSession={updateGameSession}  />
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
