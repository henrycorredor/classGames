import { createContext, useContext, useEffect, useState, useRef } from 'react'
import io from "socket.io-client"

const SocketContext = createContext()

export function useSocket() {
    return useContext(SocketContext)
}

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null)
    const canPass = useRef(true)

    console.log('esta monda se esta ejecutando dos veces lol')

    useEffect(() => {
        if (canPass.current) {
            canPass.current = false
            console.log('intenta establecer el zoquete')
            if (!socket) {
                const newSocket = io(`http://${window.location.hostname}:3000`)
                setSocket(newSocket)
                console.log('zoquete establecido')
            }
        }
        return () => { if (socket) { socket.close() } }
    }, [socket, canPass])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}