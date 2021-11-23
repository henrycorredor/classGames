import { createContext, useContext, useEffect, useState } from 'react'
import { useGameSession } from './SessionProvider'
import io from 'socket.io-client'

const SocketContext = createContext()

export function useSocket() {
	return useContext(SocketContext)
}

export function SocketProvider({ children }) {
	const [gameSession, setGameSession] = useGameSession()
	const [initialState] = useState(gameSession)
	const [socket, setSocket] = useState()

	useEffect(() => {
		const roomNumber = gameSession.game.roomNumber
		const id = initialState.user.id

		if (roomNumber !== '') {
			const params = {
				query: {
					id, roomNumber
				}
			}

			const newSocket = io('http://localhost:3000/student', params)
			newSocket.on('register-student-id', id => {
				setGameSession(prev => {
					return {
						...prev,
						user: {
							...prev.user,
							id
						}
					}
				})
			})

			console.log('conecta un socket')
			setSocket(newSocket)

			return () => newSocket.close()
		}
	}, [initialState, gameSession.game.roomNumber, setGameSession])

	useEffect(() => {
		const name = gameSession.user.name
		const roomNumber = gameSession.game.roomNumber
		const nameApproved = gameSession.user.nameApproved
		if (name !== '' && !nameApproved && socket) {
			console.log('manda nombre a aprobacion')
			console.log('el socket: ', socket);
			socket.emit('update-name', name, roomNumber)
		}
	}, [socket, gameSession.user.name, gameSession.user.nameApproved, gameSession.game.roomNumber])

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	)
}