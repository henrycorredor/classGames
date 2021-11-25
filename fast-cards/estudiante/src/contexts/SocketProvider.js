import { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = createContext()

export function useSocket() {
	return useContext(SocketContext)
}

export function SocketProvider({ children }) {
	const [socket, setSocket] = useState('')

	useEffect(() => {
		if (socket === '') {
			const newSocket = io('http://localhost:3000/student')
			setSocket(newSocket)
		}
		return (() => {
			if (socket !== '') socket.close()
		})
	}, [socket])

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	)
}