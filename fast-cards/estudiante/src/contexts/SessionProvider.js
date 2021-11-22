import { createContext, useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const GameSessionContext = createContext()

export function useGameSession() {
    return useContext(GameSessionContext)
}

export function GameSessionProvider({ children }) {
    const sessionValues = {
        user: {
            id: '',
            name: '',
            rol: '',
            nameApproved: false
        },
        game: {
            roomNumber: '',
            state: 1,
            score: 0,
        },
        classMates: []
    }
    const [gameSession, setGameSession] = useLocalStorage('session', sessionValues)
    return (
        <GameSessionContext.Provider value={[gameSession, setGameSession]}>
            {children}
        </GameSessionContext.Provider>
    )
}