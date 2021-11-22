import { useEffect, useState } from 'react'
import io from 'socket.io-client'

const PREFIX = 'cg-fast-cards-master-'

function useLocalStorage(key) {
  const prefixedKey = PREFIX + key
  const [value, setValue] = useState(() => {
    const storedValued = localStorage.getItem(prefixedKey)
    return (storedValued) ? storedValued : ''
  })

  useEffect(() => {
    localStorage.setItem(prefixedKey, value)
  }, [prefixedKey, value])

  return [value, setValue]
}

function App() {
  const [masterId, setMasterId] = useLocalStorage('id')

  useEffect(() => {
    const params = {
      query: {
        id: (masterId !== '') ? masterId : ''
      }
    }
    const socket = io('http://localhost:3001/master', params)
    console.log('intenta conectarse')
    socket.on('connect', () => {
      console.log('se conecta')
      socket.on('register-master-id', (id) => {
        setMasterId(id)
        console.log('conectado, ' + id)
      })
    })

    return () => socket.close()
  }, [masterId, setMasterId])

  return (
    <div className="App">
      Inicializando, masterd id: {masterId}
    </div>
  )
}

export default App

const masterId = localStorage.getItem(PREFIX + 'id')

const params = {
  query: {
    id: (masterId) ? masterId : ''
  }
}

const socket = io(window.location + 'master', params)

socket.on('connect', () => {
  socket.on('register-master-id', (masterId) => {
    localStorage.setItem(PREFIX + 'id', masterId)
    console.log(`recibe la id ${masterId}`)
  })
})