import { createContext, useContext, useCallback, useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
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

	const createRoom = useCallback(() => {
		if (socket !== '') {
			socket.emit('create-room', (masterId, roomNumber, students) => {
				setGameSession({ masterId, roomNumber, students })
			})
		}
	}, [socket, setGameSession])

	const verifyRoom = useCallback(() => {
		if (gameSession.roomNumber !== '') {
			socket.emit('verify-room', gameSession.roomNumber, (notFound) => {
				if (notFound) {
					setGameSession(initialGameSession)
				}
			})
		}
	}, [
		socket,
		gameSession.roomNumber,
		setGameSession])

	useEffect(() => {
		if (socket !== '') {
			if (canPass) {
				setCanPass(false)
				socket.on('connect', () => {
					if (gameSession.roomNumber !== '') verifyRoom()
				})
			}
		}
	}, [socket, canPass, verifyRoom, gameSession.roomNumber])

	return (
		<GameSessionContext.Provider value={{ createRoom, gameSession }}>
			{children}
		</GameSessionContext.Provider>
	)
}