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
	waiting: [],
	settings: {
		showStudentsName: true,
		maxPoints: 10,
		showStudentChoises: true,
		teachersTakeTurns: false,
		showWhoIsFirst: true,
		timeLimit: 0,
		numberOfCardsOnBoard: 4,
		game: 'fast-cards'
	}
}

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
			})

			socket.on('user-provide-name', (list) => {
				updateGameSession({
					waiting: list
				})
			})

			socket.on('update-students', (data) => {
				updateGameSession({
					students: data.students,
					waiting: data.waiting
				})
			})

			socket.on('game-over', () => {
				updateGameSession({ status: 5 })
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