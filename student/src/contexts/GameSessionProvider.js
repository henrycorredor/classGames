import { createContext, useContext, useState } from "react"

const GameStateContext = createContext()

export function useGameState() {
	return useContext(GameStateContext)
}

export function gameStateProvider({ children }) {
	const [gameState, setGameState] = useState('playing')

	return (
		<GameStateContext.Provider value={gameState}>
			{children}
		</GameStateContext.Provider>
	)
}