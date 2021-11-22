import { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useGameSession } from './SessionProvider'

const SocketContext = createContext()

export function useSocket() {
	return useContext(SocketContext)
}

export function SocketProvider({ children }) {
	const [gameSession] = useGameSession()
	const [socket, setSocket] = useState()

	useEffect(() => {
		const newSocket = io('http://localhost:3001')
		setSocket(newSocket)
		return () => newSocket.close()
	}, [gameSession.user.id])
	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	)
}