import { useState } from "react"
import { useGameSession } from "../contexts/GameSessionProvider"
import { useSocket } from "../contexts/SocketProvider"
import SettingsForm from "./SettingsForm"

export default function CreateRoom() {
	const socket = useSocket()
	const { gameSession, updateGameSession } = useGameSession()
	const [form, setForm] = useState(gameSession.settings)

	function createRoom() {
		socket.emit('create-room', form, (roomNumber) => {
			updateGameSession({ room: roomNumber, status: 3, settings: { ...form } })
		})
	}

	return (
		<div className='master-main-room'>
			<button onClick={createRoom} className='b3'>Crear sala</button>
			<SettingsForm setForm={setForm} form={form} />
		</div>
	)
}