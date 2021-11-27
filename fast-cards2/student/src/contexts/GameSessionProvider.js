import { createContext, useContext, useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import useUpdateSession from '../hooks/useUpdateSession'
import { useSocket } from './SocketProvider'
const GameSessionContext = createContext()

export function useGameContext() {
	return useContext(GameSessionContext)
}

const initialState = {
	game: {
		room: '',
		status: 1
	},
	user: {
		id: '',
		name: '',
		rol: 'student'
	},
	students: []
}

/*
	students array schema
	{
		id: string,
		name: string,
		online: true,
		rol: 'student'
	}
*/

export function GameSessionProvider({ children }) {
	const [gameSession, setGameSession] = useLocalStorage('game-session', initialState)
	const updateGameSession = useUpdateSession(setGameSession)
	const [canPass, setCanPass] = useState(true)
	const socket = useSocket()

	useEffect(() => {
		if (socket !== '' && canPass) {
			setCanPass(false)
			console.log('se setea los listeners')
			socket.on('connect', () => {
				updateGameSession({ game: { status: 2 } })

				if (gameSession.game.room !== '') {
					socket.emit('verify-room', gameSession.game.room, gameSession.user.id, (actualStatus) => {
						if (!actualStatus) {
							updateGameSession({
								...initialState,
								game: {
									room: '',
									status: 2
								}
							})
						} else {
							updateGameSession(actualStatus)
						}
					})
				}
			})

			socket.on('name-approved', (approved) => {
				if (approved) {
					updateGameSession({ game: { status: 4 } })
				} else {
					updateGameSession({ user: { name: '' } })
				}
			})

			socket.on('update-students-list', (studentsList) => {
				console.log('actualiza lista')
				updateGameSession({ students: studentsList })
			})

			socket.on('start-game', () => {
				updateGameSession({ game: { status: 5 } })
			})
		}
	}, [
		socket,
		canPass,
		gameSession.game.room,
		gameSession.user.id,
		updateGameSession
	])

	return (
		<GameSessionContext.Provider value={{ gameSession, updateGameSession }}>
			{children}
		</GameSessionContext.Provider>
	)
}