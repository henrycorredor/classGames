import { createContext, useContext, useCallback, useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import useUpdateSession from '../hooks/useUpdateSession'
import { useSocket } from './SocketProvider'

const GameSessionContext = createContext()

export function useGameSession() {
	return useContext(GameSessionContext)
}

const initialGameSession = {
	masterId: '',
	roomNumber: '',
	students: []
}

export function GameSessionProvider({ children }) {
	const socket = useSocket()
	const [canPass, setCanPass] = useState(true)
	const [gameSession, setGameSession] = useLocalStorage('game-session', initialGameSession)
	const updateSession = useUpdateSession(setGameSession)

	const createRoom = useCallback(() => {
		if (socket !== '') {
			socket.emit('create-room', (masterId, roomNumber, students) => {
				setGameSession({ masterId, roomNumber, students })
			})
		}
	}, [socket, setGameSession])

	const verifyRoom = useCallback(() => {
		console.log('verifica')
		if (gameSession.roomNumber !== '') {
			socket.emit('verify-room', gameSession.roomNumber, (notFound, students) => {
				if (notFound) {
					setGameSession(initialGameSession)
				} else {
					updateSession({ students })
				}
			})
		}
	}, [
		socket,
		gameSession.roomNumber,
		setGameSession,
		updateSession])

	useEffect(() => {
		if (socket !== '') {
			if (canPass) {
				setCanPass(false)

				socket.on('connect', () => {
					console.log('conectado')
					if (gameSession.roomNumber !== '') verifyRoom()
				})

				socket.on('new-student-registered', (incomeStudents) => {
					console.log('actualiza sesion')
					updateSession({ students: incomeStudents })
				})
			}
		}
	}, [
		socket,
		canPass,
		verifyRoom,
		gameSession,
		updateSession
	])

	return (
		<GameSessionContext.Provider value={{ createRoom, updateSession, gameSession }}>
			{children}
		</GameSessionContext.Provider>
	)
}