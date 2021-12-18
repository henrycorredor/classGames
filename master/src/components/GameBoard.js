import { useGameState } from "../contexts/GameStateProvider"
import CreateRoom from "./CreateRoom"
import WaitingStudents from "./WaitingStudents"
import GameOver from "./GameOver"
import { useSocket } from "../contexts/SocketProvider"

export default function GameBoard() {
	const socket = useSocket()
	const { gameState } = useGameState()

	switch (gameState.status) {
		case 0:
			return <div>Conectando...</div>
		case 1:
			return <CreateRoom />
		case 2:
			return <div><WaitingStudents /><button onClick={() => socket.emit('print')}>Miau</button></div>
		case 3:
			return <div><div className='small-board center'>Jugando</div><button onClick={() => socket.emit('print')}>Miau</button></div>
		case 4:
			return <GameOver />
		default:
			return <div className='small-board center'>Oops...</div>
	}
}