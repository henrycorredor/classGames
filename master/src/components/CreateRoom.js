import { useState } from "react"
import { useGameState } from "../contexts/GameStateProvider"
import { useSocket } from "../contexts/SocketProvider"
import SettingsForm from "./SettingsForm"

export default function CreateRoom() {
	console.log('renderiza create room')
	const socket = useSocket()
	const { gameState, updateGameState, gamesList } = useGameState()
	const [gameOptions, setGameOptions] = useState(gameState.game)

	function createRoom() {
		socket.emit('create-room', gameOptions, (roomNumber) => {
			updateGameState({ room: roomNumber, status: 3, game: gameOptions })
		})
	}

	return (
		<div className='master-main-room'>
			<button onClick={createRoom} className='b3'>Crear sala</button>
			<SettingsForm gamesList={gamesList} gameOptions={gameOptions} setGameOptions={setGameOptions} />
		</div>
	)
}