import { useGameSession } from '../contexts/SessionProvider'
import { useCallback, useEffect } from 'react'
import { CardsBoardProvider } from '../contexts/CardsGameProvider'
import Login from './Login'
import WaitingRoom from './WaitingRoom'
import CardsBoard from './CardsBoard'

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
	const [gameSession, setGameSession] = useGameSession()
	const { user, game } = gameSession

	const updateGameState = useCallback((state) => {
		setGameSession(original => {
			const newState = {
				...original.game,
				state
			}
			return {
				...original,
				game: { ...newState }
			}
		})
	}, [setGameSession])

	useEffect(() => {
		if (!game.roomNumber || !user.name) {
			updateGameState(2)
		} else if (!user.nameApproved) {
			updateGameState(3)
		} else {

		}
	}, [game.roomNumber, user.name, user.nameApproved, updateGameState])

	function teacherApproveMyName(approved) {
		setGameSession(original => {
			let newItem
			if (approved) {
				newItem = {
					user: {
						...original.user,
						nameApproved: true
					}
				}
			} else {
				newItem = {
					user: {
						...original.user,
						name: ''
					}
				}
			}
			return {
				...original,
				...newItem
			}
		})
		updateGameState(4)
	}

	function teacherStartsGame() {
		updateGameState(5)
	}

	let imprimirEsto
	switch (game.state) {
		case 1:
		case 2:
			imprimirEsto = <Login />
			break
		case 3:
		case 4:
			imprimirEsto = <WaitingRoom teacherAprove={teacherApproveMyName} teacherStats={teacherStartsGame} />
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
