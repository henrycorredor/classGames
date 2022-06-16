import { createContext, useContext, useState } from "react"
import useUpdateSession from "../hooks/useUpdateSession"

const SessionContext = createContext()

const initialSession = {
    status: "playing",
    players: [
        { id: "1", name: "Jugador 1", myTurn: true },
        { id: "2", name: "Jugador 2", myTurn: false }
    ],
    game: {
        deck: ['1', '2', '3', '4'],
        actualSelection: 0,
        secuence: [],
        clickedSecuence: [],
        turnStatus: 'waitingFirstClick'
    }
}

export function useSession() {
    return useContext(SessionContext)
}

export function SessionProvider({ children }) {
    const [session, setSession] = useState({ ...initialSession })
    const updateSession = useUpdateSession(setSession)
    return <SessionContext.Provider value={{ session, updateSession }}>
        {children}
    </SessionContext.Provider>
}