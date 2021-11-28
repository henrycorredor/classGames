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
	students: [],
	cardsDeck: {
		randomSelection: [],
		rightAnswer: '',
		clicked: [],
		points: ''
	}
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
			socket.on('connect', () => {
				updateGameSession({ game: { status: 2 } })
				console.log('reconecta')
				if (gameSession.game.room !== '') {
					console.log('verifica')
					socket.emit('verify-room', gameSession.game.room, gameSession.user.id, (sessionFound, actualStatus) => {
						console.log(actualStatus)
						if (sessionFound) {
							updateGameSession(actualStatus)
						} else {
							updateGameSession({
								...initialState,
								game: {
									room: '',
									status: 2
								}
							})
						}
					})
				}else{
					console.log('no verifica')
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
				console.log(gameSession)
				console.log('esta es mi id', gameSession.user.id)
				if (studentsList.some(s => (s.rol === 'teacher' && s.id === gameSession.user.id))) {
					console.log('se vuelve teacher')
					updateGameSession({ user: { rol: 'teacher' }, students: studentsList })
				} else {
					console.log('no señor')
					updateGameSession({ students: studentsList })
				}
			})

			socket.on('start-game', (newCardsDeck) => {
				updateGameSession({ game: { status: 5 }, cardsDeck: { ...newCardsDeck } })
			})

			socket.on('update-cards-deck', (cardsDeck) => {
				console.log('nuevo deck')
				updateGameSession({ cardsDeck })
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