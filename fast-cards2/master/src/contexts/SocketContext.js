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
			socket = io('http://localhost:3000/student')
			setSocket(socket)
		}
	}, [socket])

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	)
}