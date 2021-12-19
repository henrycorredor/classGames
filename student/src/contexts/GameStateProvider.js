import { createContext, useContext, useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import useUpdateState from '../hooks/useUpdateState'
import { useSocket } from './SocketProvider'
const GameStateContext = createContext()

export function useGameStateContext() {
	return useContext(GameStateContext)
}

const initialState = {
	game: {
		room: '',
		status: 0,
		id: '',
		settings: '',
		props: ''
	},
	user: {
		id: '',
		name: '',
		rol: 'student',
		status: 0
	},
	users: [],
}

export function GameStateProvider({ children }) {
	const [gameState, setGameState] = useLocalStorage('game-session', initialState)
	const updateGameState = useUpdateState(setGameState)
	const [pass, setPass] = useState(true)
	const socket = useSocket()

	useEffect(() => {
		if (socket !== '') {
			socket.removeAllListeners('connect')
			socket.on('connect', () => {
				const room = gameState.game.room
				const id = gameState.user.id

				if (room === '') {
					updateGameState({ user: { status: 1, rol: 'student' } })
				} else {
					socket.emit('verify-room', room, id, (exist, gameObj) => {
						if (exist) {
							console.log(gameObj)
							updateGameState({ ...gameObj })
						} else {
							updateGameState({ user: { status: 1, rol: 'student' } })
						}
					})
				}
			})
		}
	}, [
		socket,
		gameState.game.room,
		gameState.user.id,
		updateGameState
	])

	useEffect(() => {
		if (socket !== '') {
			socket.removeAllListeners('update-user-list')
			socket.on('update-user-list', (userList) => {
				const myProfile = userList.filter(u => u.id === gameState.user.id)
				if (myProfile.length !== 0) {
					updateGameState({ users: userList, user: { rol: myProfile[0].rol } })
				}
			})

			socket.removeAllListeners('update-game-state')
			socket.on('update-game-state', (obj) => {
				console.log(obj)
				if (obj.users) {
					const myProfile = obj.users.filter(u => u.id === gameState.user.id)
					if (myProfile[0]) {
						obj.user.rol = myProfile[0].rol
					}
				}
				updateGameState({ ...obj })
			})

			if (pass) {
				setPass(false)
				socket.on('update-game', (obj) => {
					updateGameState({ game: obj })
				})
				socket.on('update-user', (obj) => {
					updateGameState({ user: obj })
				})
				socket.on('start-game', (gameObj) => {
					updateGameState({ game: { ...gameObj }, user: { status: 3 } })
				})
			}
		}
	}, [socket, pass, gameState.user.id, updateGameState])

	return (
		<GameStateContext.Provider value={{ gameState, updateGameState }}>
			{children}
		</GameStateContext.Provider>
	)
}