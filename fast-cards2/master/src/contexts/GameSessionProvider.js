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
	students: [],
	waiting: []
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
		console.log('canPass', canPass, 'socket', (socket !== ''))
		if (socket !== '' && canPass) {
			console.log('se instauran los listeners basicos')
			socket.on('connect', () => {
				console.log('conectado')
				setCanPass(false)
				if (gameSession.room !== '') {
					socket.emit('verify-sesion', gameSession.room, (found, session) => {
						console.log('verifica sala')
						if (found) {
							updateGameSession(session)
						} else {
							updateGameSession({
								...initialGameSession,
								status: 2
							})
						}
					})
				} else {
					updateGameSession({
						...initialGameSession,
						status: 2
					})
				}

				socket.on('user-provide-name', (list) => {
					updateGameSession({
						waiting: list
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