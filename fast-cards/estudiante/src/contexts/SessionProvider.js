import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
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

export function GameSessionProvider({ children }) {
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

	const [gameSession, setGameSession] = useLocalStorage('session', initialSessionValues)
	const [initialRoomNumber] = useState(gameSession.game.roomNumber)
	const socket = useSocket()

	const updateGameSession = useCallback((toUpdate, section) => {
		setGameSession(sessionPrev => {
			const userPrev = sessionPrev.user
			const gamePrev = sessionPrev.game
			const userToUpdate = (section === 'user') ? toUpdate : {}
			const gameToUpdate = (section === 'game') ? toUpdate : {}
			return ({
				user: {
					...userPrev,
					...userToUpdate
				},
				game: {
					...gamePrev,
					...gameToUpdate
				},
				classMates: [...sessionPrev.classMates]
			})
		})
	}, [setGameSession])

	const restoreSession = useCallback(() => {
		console.log('recostruye sesion')
		updateGameSession({ state: 1, roomNumber: '' }, 'game')
		updateGameSession({ name: '' }, 'user')
	}, [updateGameSession])

	const verifyRoom = useCallback((initialRoomNumber) => {
		const roomNumber = (initialRoomNumber) ? initialRoomNumber : gameSession.game.roomNumber
		console.log('verifica sala numero ', roomNumber)
		socket.emit('verify-room', roomNumber, (noFound) => {
			if (noFound) {
				restoreSession()
			}
		})
	}, [restoreSession, socket, gameSession.game.roomNumber])

	useEffect(() => {
		if (socket != null) {
			if (initialRoomNumber !== '') {
				verifyRoom(initialRoomNumber)
			}

			socket.io.on('reconnect', () => {
				console.log('reconecta')
				verifyRoom()
			})
		}
	}, [socket, initialRoomNumber, verifyRoom])

	return (
		<GameSessionContext.Provider value={[gameSession, updateGameSession]}>
			{children}
		</GameSessionContext.Provider>
	)
}