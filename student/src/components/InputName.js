import { useState } from "react"
import { useSocket } from "../contexts/SocketProvider"
import { useTranslation } from "react-i18next"

export default function InputName() {
	const [userName, setUserName] = useState("")
	const socket = useSocket()
	const { t } = useTranslation()

	function handleSubmit(e) {
		e.preventDefault();
		socket.emit('register-name', userName)
	}

	return (
		<div className="formContainer">
			<form onSubmit={handleSubmit}>
				<input type="text" name="userName" placeholder={t('TU_NOMBRE')} value={userName} onChange={(e) => setUserName(e.target.value)} />
				<button type="submit">{t('INGRESAR')}</button>
			</form>
		</div>
	)
}