import { useState } from "react"
import { useGameSession } from "../contexts/GameSessionProvider"
import { useSocket } from "../contexts/SocketProvider"
import SettingsForm from "./SettingsForm"
import './styles/GameOver.css'

export default function GameOver() {
	const { gameSession, updateGameSession } = useGameSession()
	const [form, setForm] = useState(gameSession.settings)
	const socket = useSocket()

	function handleSubmit() {
		updateGameSession({ settings: { ...form } })
		socket.emit('start-game', form, () => {
			updateGameSession({ status: 4 })
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