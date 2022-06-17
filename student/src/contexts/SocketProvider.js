import { createContext, useContext, useState } from 'react'
import io from "socket.io-client"

const SocketContext = createContext()

export function useSocket() {
    return useContext(SocketContext)
}

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null)

    console.log('esta monda se esta ejecutando dos veces lol')
    
    if (!socket) {
        const newSocket = io(`http://${window.location.hostname}:3000`)
        setSocket(newSocket)
        console.log('establece conexión', newSocket, socket)
    }

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}