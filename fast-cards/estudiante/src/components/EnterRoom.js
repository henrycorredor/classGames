import { useState } from "react"
import { useSocket } from "../contexts/SocketProvider"

export default function EnterRoom({ updateGameSession }) {
	const socket = useSocket()

	const [warning, setWarning] = useState('')
	const [roomNumber, setRoomNumber] = useState('')

	function handelChange({ target }) {
		setRoomNumber(target.value)
		setWarning('')
	}

	function handleSubmit(e) {
		e.preventDefault()
		socket.emit('join-room', roomNumber, (ok, warning) => {
			if (ok) {
				console.log('hecho')
				updateGameSession({ roomNumber, state: 2 }, 'game')
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