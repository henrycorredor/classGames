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
            const socketUrl = process.env.REACT_APP_NODE_ENV === 'local' ?
                process.env.REACT_APP_SOCKET_URL :
                `http://${window.location.hostname}`
            if (!socket) {
                const newSocket = io(socketUrl)
                setSocket(newSocket)
                console.log(`zoquete establecido desde ${socketUrl}, ${process.env.REACT_APP_NODE_ENV}`)
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