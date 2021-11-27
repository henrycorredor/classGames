import { useContext, createContext, useEffect, useState } from "react"
import useUpdateGameSession from "../hooks/useUpdateGameSession"
import useLocalStorage from "../hooks/useLocalStorage"
import { useSocket } from "./SocketContext"

const GameSessionContext = createContext()

export function useGameSession() {
	return useContext(GameSessionContext)
}

const initialGameSession = {
	game: {
		room: '',
		status: 1,
		id: string
	},
	students: []
}

/*
students array schema:
{
	id: string,
	name: string,
	online: true,
	rol: 'student'
}
*/

export function GameSessionProvider({ children }) {
	const [gameSession, setGameSession] = useLocalStorage('game-session', initialGameSession)
	const updateGameSession = useUpdateGameSession(setGameSession)
	const [canPass,setCanPass] = useState(true)
	const socket = useSocket()

	useEffect(()=>{
		if(socket!==''){
			if(canPass){
				setCanPass(false)
				socket.on('connect',()=>{
					console.log('conectado')
					updateGameSession({game: {status:2}})
				})
			}
		}
	},[socket])
	return (
		<GameSessionContext.Provider value={{gameSession, updateGameSession}}>
			{children}
		</GameSessionContext.Provider>
	)
}