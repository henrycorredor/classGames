import { useContext, createContext, useEffect, useState } from "react"
import useUpdateGameSession from "../hooks/useUpdateGameSession"
import useLocalStorage from "../hooks/useLocalStorage"
import { useSocket } from "./SocketProvider"

const GameSessionContext = createContext()

export function useGameSession() {
	return useContext(GameSessionContext)
}

const initialGameSession = {
	room: '',
	status: 1,
	students: []
}

/*
students array schema:
{
	id: string,
	name: string,
	online: true,
	rol: 'student'
}
*/

export function GameSessionProvider({ children }) {
	const [gameSession, setGameSession] = useLocalStorage('game-session', initialGameSession)
	const updateGameSession = useUpdateGameSession(setGameSession)
	const [canPass, setCanPass] = useState(true)
	const socket = useSocket()

	useEffect(() => {
		if (socket !== '' && canPass) {
			setCanPass(false)

			socket.on('connect', () => {
				console.log('conectado')

				if (gameSession.room !== '') {
					socket.emit('verify-sesion', gameSession.room, (actualSession) => {
						console.log('verifica sala', actualSession)
						if (!actualSession) {
							updateGameSession({
								...initialGameSession,
								status: 2
							})
						} else {
							updateGameSession(actualSession)
						}
					})
				} else {
					updateGameSession({ status: 2 })
				}

				socket.on('user-provide-name', (studentList) => {
					updateGameSession({
						students: studentList
					})
				})
			})
		}
	}, [
		socket,
		canPass,
		gameSession.room,
		updateGameSession
	])
	return (
		<GameSessionContext.Provider value={{ gameSession, updateGameSession }}>
			{children}
		</GameSessionContext.Provider>
	)
}