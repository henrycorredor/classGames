import { useGameSession } from "../contexts/GameSessionProvider"
import CreateRoom from "./CreateRoom"
import WaitingStudents from "./WaitingStudents"
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
		case 4:
			return <div>Jugando <button onClick={() => socket.emit('print')}>Miau</button></div>
		case 5:
			return <div>Finalizado<button onClick={() => socket.emit('print')}>Miau</button></div>
		default:
			return <div>Oops...</div>
	}
}