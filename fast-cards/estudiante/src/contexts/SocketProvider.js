import { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = createContext()

export function useSocket() {
	return useContext(SocketContext)
}

export function SocketProvider({ children }) {
	const [socket, setSocket] = useState()

	useEffect(() => {
		const newSocket = io('http://localhost:3000/student')
		console.log('intenta conectar el socket')
		newSocket.on('connect', () => {
			setSocket(newSocket)
			console.log('conectado')
		})
		return (() => { newSocket.close() })
	}, [])

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	)
}