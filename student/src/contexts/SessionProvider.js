import { createContext, useContext, useEffect, useState } from "react"
import useUpdateSession from "../hooks/useUpdateSession"
import { useSocket } from "./SocketProvider"

const SessionContext = createContext()

const initialSession = {
    status: "connecting",
    myInfo: {
        id: '',
        name: '',
        myTurn: false
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

            socket.on('gameObj', (gameObj) => {
                console.log('actualiza objeto de juego')
                socket.emit('update-my-info', (myInfo) => {
                    updateSession({
                        myInfo,
                        ...gameObj
                    })
                })
            })
        }
    }, [session.status, session.myInfo, socket, updateSession])

    return <SessionContext.Provider value={{ session, updateSession }}>
        {children}
    </SessionContext.Provider>
}