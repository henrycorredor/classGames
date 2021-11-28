import { useGameSession } from "../contexts/GameSessionProvider"
import { useSocket } from "../contexts/SocketProvider"

export default function CreateRoom() {
	const socket = useSocket()
	const { updateGameSession } = useGameSession()

	function createRoom() {
		socket.emit('create-room', (roomNumber) => {
			updateGameSession({ room: roomNumber, status: 3 })
		})
	}

	return <button onClick={createRoom}>Crear sala</button>
}