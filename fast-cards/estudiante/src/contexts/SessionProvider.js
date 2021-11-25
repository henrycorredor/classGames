import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import useUpdateGameSession from '../hooks/useUpdateGameSession'
import { useSocket } from './SocketProvider'

const GameSessionContext = createContext()

export function useGameSession() {
	return useContext(GameSessionContext)
}

/**
States:
0 - waiting for connect the socket
				- socket connected
1- Input room number
				- submit room number, wait for confirmation
2 - Confirmated room, input name
				- submit name, wait for approval
3 - Name confirmed, waiting classmates
				- teacher starts the game
4 - Game
*/

const initialSessionValues = {
	user: {
		id: '',
		name: '',
		rol: '',
		nameApproved: false
	},
	game: {
		roomNumber: '',
		state: 0,
		score: 0,
	},
	classMates: []
}

export function GameSessionProvider({ children }) {
	const [gameSession, setGameSession] = useLocalStorage('session', initialSessionValues)
	const updateGameSession = useUpdateGameSession(gameSession, setGameSession)
	const [canPass, setCanPass] = useState(true)
	const socket = useSocket()

	const restoreSession = useCallback(() => {
		console.log('recostruye sesion')
		updateGameSession({ state: 1, roomNumber: '' }, 'game')
		updateGameSession({ name: '' }, 'user')
	}, [updateGameSession])

	const verifyRoom = useCallback(() => {
		const roomNumber = gameSession.game.roomNumber
		console.log('verifica sala numero')
		socket.emit('verify-room', roomNumber, (noFound) => {
			if (noFound) {
				console.log('recostruye')
				restoreSession()
			}
		})
	}, [restoreSession, socket, gameSession.game.roomNumber])


	useEffect(() => {
		if (socket !== '') {
			if (canPass) {
				setCanPass(false)

				socket.on('connect', () => {
					console.log('conectado')

					if (gameSession.game.roomNumber !== '') {
						verifyRoom()
					} else {
						updateGameSession({ state: 1 }, 'game')
					}
				})
			}
		}
	}, [
		socket,
		gameSession.game.roomNumber,
		updateGameSession,
		verifyRoom,
		canPass
	])

	return (
		<GameSessionContext.Provider value={[gameSession, updateGameSession]}>
			{children}
		</GameSessionContext.Provider>
	)
}