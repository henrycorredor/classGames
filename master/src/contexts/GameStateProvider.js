import { useContext, createContext, useEffect, useState } from "react"
import useUpdateGameState from "../hooks/useUpdateGameState"
import useLocalStorage from "../hooks/useLocalStorage"
import { useSocket } from "./SocketProvider"

const GameStateContext = createContext()

export function useGameState() {
	return useContext(GameStateContext)
}

const gamesList = [
	{
		name: 'Fast cards',
		id: 'fastCards',
		settings: {
			needTeacher: true,
			numberOfCardsOnBoard: 4,
			maxPoints: 10,
			showStudentsName: true,
			showStudentChoises: true,
			showWhoIsFirst: true
		}
	}, {
		name: 'Probando',
		id: 'test',
		settings: { needTeacher: true }
	}
]

const initialGameState = {
	id: '',
	room: '',
	status: 0,
	users: [],
	game: gamesList[0]
}

export function GameStateProvider({ children }) {
	const [gameState, setGameState] = useLocalStorage('game-state', initialGameState)
	const updateGameState = useUpdateGameState(setGameState)
	const [canPass, setCanPass] = useState(true)
	const socket = useSocket()

	useEffect(() => {
		if (socket !== '' && canPass) {
			setCanPass(false)

			socket.on('update-user-list', (userList) => {
				updateGameState({ users: userList })
			})

			socket.on('update-game-obj', (gameObj) => {
				updateGameState({ game: gameObj })
			})
		}
	}, [
		socket,
		canPass,
		updateGameState
	])

	useEffect(() => {

		if (socket !== '') {

			const id = gameState.id
			const room = gameState.room

			socket.removeAllListeners('connect')
			socket.on('connect', () => {

				if (room !== '') {

					socket.emit('verify-room', id, room, (found, gameObj, userList, myStatus) => {

						if (found) {
							updateGameState({
								users: userList,
								game: gameObj,
								status: myStatus
							})
						} else {
							updateGameState({
								...initialGameState,
								status: 1
							})
						}

					})

				} else {
					updateGameState({ status: 1 })
				}

			})
		}

	}, [
		socket,
		gameState.id,
		gameState.room,
		updateGameState
	])

	return (
		<GameStateContext.Provider value={{ gameState, updateGameState, gamesList }}>
			{children}
		</GameStateContext.Provider>
	)
}