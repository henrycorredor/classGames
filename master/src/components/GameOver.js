import { useState } from "react"
import { useGameState } from "../contexts/GameStateProvider"
import { useSocket } from "../contexts/SocketProvider"
import SettingsForm from "./SettingsForm"
import './styles/GameOver.css'

export default function GameOver() {
	const { gameState, updateGameState } = useGameState()
	const [form, setForm] = useState(gameState.settings)
	const socket = useSocket()

	function handleSubmit() {
		updateGameState({ settings: { ...form } })
		socket.emit('start-game', form, () => {
			updateGameState({ status: 3 })
		})
	}

	return (
		<div className='game-over'>
			<div className='small-board'>¡Muy bien!</div>
			<div className='again-form'>
				<button onClick={handleSubmit} className='b3'>¿Otra vez?</button>
				<SettingsForm form={form} setForm={setForm} />
			</div>
		</div>
	)
}