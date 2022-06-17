import { createContext, useContext, useEffect, useState } from "react"
import useUpdateSession from "../hooks/useUpdateSession"
import { useSocket } from "./SocketProvider"

const SessionContext = createContext()

const initialSession = {
    status: "connecting",
    myInfo: {
        id: '',
        name: ''
    },
    players: [],
    game: {
        deck: ['1', '2', '3', '4'],
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
    const socket = useSocket()

    useEffect(() => {
        if (socket && session.status === 'connecting') {
            console.log('establece listeners')

            socket.on('myId', (myData) => {
                console.log('recibida información personal')
                updateSession({ myInfo: { ...myData } })
            })

            socket.on('gameObj', (gameObj) => {
                console.log('hey update!')
                updateSession({ ...gameObj })
            })
        }
    }, [session.status, socket, updateSession])

    return <SessionContext.Provider value={{ session, updateSession }}>
        {children}
    </SessionContext.Provider>
}