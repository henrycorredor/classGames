import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import useUpdateGameSession from '../hooks/useUpdateGameSession'
import useLocalStorage from '../hooks/useLocalStorage'
import { useSocket } from './SocketProvider'

const GameSessionContext = createContext()

export function useGameSession() {
	return useContext(GameSessionContext)
}

/**
States:
0 - Waiting for connect the socket
				- socket connected
1- Socket connected, Input room number
				- submit room number
2 - Confirmated room, input name
				- submit name
3 - Name submited, waiting for teacher approval
				- teacher approved
4 - Approved, wait for teacher to start
				- game started
5 - Game
*/

const initialSessionValues = {
	user: {
		id: '',
		name: '',
		rol: ''
	},
	game: {
		roomNumber: '',
		state: 0,
		score: 0,
	},
	classMates: []
}
// classMates: [{name: '', id: '', rol: ''}]

export function GameSessionProvider({ children }) {
	const [gameSession, setGameSession] = useLocalStorage('session', initialSessionValues)
	const updateGameSession = useUpdateGameSession(setGameSession)
	const [canPass, setCanPass] = useState(true)
	const socket = useSocket()

	const restoreSession = useCallback(() => {
		updateGameSession({ user: { name: 'w' }, game: { state: 1, roomNumber: '' } })
	}, [updateGameSession])

	const verifyRoom = useCallback(() => {
		const roomNumber = gameSession.game.roomNumber
		socket.emit('verify-room', roomNumber, (notFound) => {
			if (notFound) {
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
						updateGameSession({ game: { state: 1 } })
					}
				})

				socket.on('name-approved', (approved) => {
					if (approved) {
						updateGameSession({ game: { state: 4 } })
					} else {
						updateGameSession({ game: { state: 2 }, user: { name: '' } })
					}
				})

				socket.on('update-students-list', (studentsList) => {
					console.log('actualiza lista')
					updateGameSession({ classMates: studentsList })
				})

				socket.on('start-game',()=>{
					console.log('empieza el juego')
					updateGameSession({ game: { state: 5 } })
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
		<GameSessionContext.Provider value={{gameSession, updateGameSession}}>
			{children}
		</GameSessionContext.Provider>
	)
}