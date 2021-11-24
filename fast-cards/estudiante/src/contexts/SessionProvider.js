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
	const [initialState] = useState(gameSession)
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

	useEffect(() => {
		if (socket != null) {
			const initialRoomNumber = initialState.game.roomNumber
			console.log('numero de sala ', initialRoomNumber)
			if (initialRoomNumber !== '') {
				console.log('verifica numero de sala')
				socket.emit('verify-room', initialRoomNumber, (stillExist) => {
					if (!stillExist) {
						console.log('recostruye sesion')
						updateGameSession({ state: 1 }, 'game')
						updateGameSession({ name: '' }, 'user')
						updateGameSession({ roomNumber: '' }, 'game')
					} else {
						console.log('reaunda sesion')
					}
				})
			}

		}
	}, [socket, initialState, updateGameSession])

	return (
		<GameSessionContext.Provider value={[gameSession, updateGameSession]}>
			{children}
		</GameSessionContext.Provider>
	)
}