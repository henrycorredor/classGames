import { createContext, useContext, useEffect } from 'react'
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
		data: {
			id: '',
			settings: '',
			props: ''
		}
	},
	user: {
		id: '',
		name: '',
		rol: 'student'
	},
	students: [],
}

export function GameStateProvider({ children }) {
	const [gameState, setGameState] = useLocalStorage('game-session', initialState)
	const updateGameState = useUpdateState(setGameState)
	//const [pass, setPass] = useState(true)
	const socket = useSocket()

	useEffect(() => {
		if (socket !== '') {
			socket.removeAllListeners('connect')
			socket.on('connect', () => {
				const room = gameState.game.room
				const id = gameState.user.id

				if (room === '') {
					updateGameState({ game: { status: 1 } })
				} else {
					socket.emit('verify-room', room, id, (exist, gameObj) => {
						if (exist) {
							updateGameState({ ...gameObj })
						} else {
							updateGameState({ game: { status: 1 } })
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
			socket.on('update-user-list', (userList) => {
				console.log(userList)
				setGameState({ students: userList })
			})
		}
	}, [socket, setGameState])

	return (
		<GameStateContext.Provider value={{ gameState, updateGameState }}>
			{children}
		</GameStateContext.Provider>
	)
}