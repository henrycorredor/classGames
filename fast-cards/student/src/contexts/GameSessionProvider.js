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
		points: '',
		gameState: 1
	},
	settings: {
		showStudentsName: true,
		maxPoints: 10,
		showStudentChoises: true,
		teachersTakeTurns: false,
		showWhoIsFirst: true,
		timeLimit: 0
	}
}

export function GameSessionProvider({ children }) {
	const [gameSession, setGameSession] = useLocalStorage('game-session', initialState)
	const updateGameSession = useUpdateSession(setGameSession)
	const [canPass, setCanPass] = useState(true)
	const socket = useSocket()

	useEffect(() => {
		if (socket !== '') {
			setCanPass(false)
			if (canPass) {
				socket.on('disconnect', () => {
					console.log('desconectado')
				})

				socket.on('name-approved', (approved) => {
					if (approved) {
						updateGameSession({ game: { status: 4 } })
					} else {
						updateGameSession({ user: { name: '' } })
					}
				})

				socket.on('start-game', (newCardsDeck) => {
					console.log(newCardsDeck)
					updateGameSession({ game: { status: 5 }, cardsDeck: { ...newCardsDeck } })
				})

				socket.on('update-cards-deck', (cardsDeck) => {
					console.log('update cards')
					updateGameSession({ cardsDeck })
				})
			}
		}
	}, [
		socket,
		canPass,
		updateGameSession
	])

	useEffect(() => {
		if (socket !== '') {
			const myRoom = gameSession.game.room
			const myId = gameSession.user.id
			socket.removeAllListeners('connect')
			socket.on('connect', () => {
				if (myRoom !== '') {
					socket.emit('verify-room', myRoom, myId, (sessionFound, actualStatus) => {
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
				} else {
					updateGameSession({ game: { status: 2 } })
				}
			})

			socket.removeAllListeners('update-students-list')
			socket.on('update-students-list', (studentsList) => {
				const myRol = studentsList.filter(s => s.id === myId)
				if (myRol[0]) {
					updateGameSession({ user: { rol: myRol[0].rol }, students: studentsList })
				} else {
					updateGameSession({ students: studentsList })
				}
			})
		}
	}, [
		socket,
		gameSession.user.id,
		gameSession.game.room,
		updateGameSession
	])

	return (
		<GameSessionContext.Provider value={{ gameSession, updateGameSession }}>
			{children}
		</GameSessionContext.Provider>
	)
}