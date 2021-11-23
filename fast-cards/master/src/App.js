import { useEffect, useState } from 'react'
import io from 'socket.io-client'

const PREFIX = 'cg-fast-cards-master-'

function useLocalStorage(key) {
  const prefixedKey = PREFIX + key
  const [value, setValue] = useState(() => {
    const storedValued = localStorage.getItem(prefixedKey)
    return (storedValued) ? JSON.parse(storedValued) : ''
  })

  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(value))
  }, [prefixedKey, value])

  return [value, setValue]
}

function App() {
  const [sessionInfo, setSessionInfo] = useLocalStorage('game-session')

  useEffect(() => {
    const params = {
      query: {
        id: (sessionInfo !== '') ? sessionInfo.masterId : '',
        roomNumber: (sessionInfo !== '') ? sessionInfo.roomNumber : ''
      }
    }
    const socket = io('http://localhost:3000/master', params)
    socket.on('connect', () => {
      socket.on('register-game-session', (data) => {
        setSessionInfo(data)
      })
    })

    return () => socket.close()
  }, [sessionInfo, setSessionInfo])

  return (
    <div className="App">
      Inicializando, masterd id: {sessionInfo.masterId} <br />
      Sala número {sessionInfo.roomNumber}
    </div>
  )
}

export default App