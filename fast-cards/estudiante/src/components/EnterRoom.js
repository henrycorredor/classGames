import { useState } from "react"
import { useSocket } from "../contexts/SocketProvider"
import { useGameSession } from "../contexts/SessionProvider"

export default function EnterRoom() {
	const socket = useSocket()
	const {updateGameSession} = useGameSession()

	const [warning, setWarning] = useState('')
	const [roomNumber, setRoomNumber] = useState('')

	function handelChange({ target }) {
		setRoomNumber(target.value)
		setWarning('')
	}

	function handleSubmit(e) {
		e.preventDefault()
		socket.emit('join-room', roomNumber, (ok, newId, warning) => {
			if (ok) {
				updateGameSession({ game: { roomNumber, state: 2 }, user: { id: newId } })
			} else {
				setWarning(warning)
				setRoomNumber('')
			}
		})
	}

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<label>
					Número de sala:
					<input type="text" onChange={handelChange} value={roomNumber} /> <br />
					{(warning) ? <><div>{warning}</div><br /></> : null}
					<button onClick={handleSubmit}>Ingresar</button>
				</label>
			</form>
		</div>
	)
}