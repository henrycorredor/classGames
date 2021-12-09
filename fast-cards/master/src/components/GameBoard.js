import { useGameSession } from "../contexts/GameSessionProvider"
import CreateRoom from "./CreateRoom"
import WaitingStudents from "./WaitingStudents"
import GameOver from "./GameOver"
import { useSocket } from "../contexts/SocketProvider"

export default function GameBoard() {
	const socket = useSocket()
	const { gameSession } = useGameSession()

	switch (gameSession.status) {
		case 1:
			return <div>Conectando...</div>
		case 2:
			return <CreateRoom />
		case 3:
			return <div><WaitingStudents /><button onClick={() => socket.emit('print')}>Miau</button></div>
		//return <WaitingStudents />
		case 4:
			return <div><div className='small-board center'>Jugando</div><button onClick={() => socket.emit('print')}>Miau</button></div>
		case 5:
			return <GameOver />
		default:
			return <div className='small-board center'>Oops...</div>
	}
}