import { createContext, useContext, useEffect, useState } from 'react'
import { useGameContext } from './GameSessionProvider'
import { useSocket } from './SocketProvider'

const CardsDeckContext = createContext()

export function useGameDeck() {
	return useContext(CardsDeckContext)
}

export function CardsDeckProvider({ children }) {
	const socket = useSocket()
	const [cardsDeck, setCardsDeck] = useState('')
	const { updateGameSession } = useGameContext()

	useEffect(() => {
		console.log('monta listeners de cards')
		if (socket !== '') {
			socket.on('start-game', (newCardsDeck) => {
				console.log(newCardsDeck)
	
				updateGameSession({ game: { status: 5 } })
				setCardsDeck(newCardsDeck)
			})
		}

		return () => {
			console.log('desmonta los listeners')
			if (socket !== '') socket.off('start-game')
		}
	}, [socket, updateGameSession])

	return (
		<CardsDeckContext.Provider value={{ cardsDeck }}>
			{children}
		</CardsDeckContext.Provider>
	)
}