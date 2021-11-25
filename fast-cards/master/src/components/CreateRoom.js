import { useGameSession } from "../contexts/GameSessionProvider"

export default function CreateRoom() {
	const { createRoom } = useGameSession()
	
	return <div>
		<button type='submit' onClick={createRoom}>Generar sala</button>
	</div>
}