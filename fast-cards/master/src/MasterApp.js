import { useEffect, useState } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import io from 'socket.io-client'

function App() {
  const initialGameState = {
    masterId: '',
    roomNumber: '',
    students: []
  }

  const [gameState, setGameState] = useLocalStorage('game-session', initialGameState)
  const [initialState] = useState(gameState)
  const [socket, setSocket] = useState()

  useEffect(() => {
    const params = {
      query: {
        masterId: (initialState.masterId) ? initialState.masterId : '',
        roomNumber: (initialState.roomNumber) ? initialState.roomNumber : ''
      }
    }
    const newSocket = io('http://localhost:3000/master', params)
    newSocket.on('connect', () => {
      setSocket(newSocket)
    })

    newSocket.on('inexistent-room', () => {
      setGameState(state => {
        return {
          ...state,
          roomNumber: ''
        }
      })
    })

    newSocket.on('new-student-registered', (studentsArray) => {
      setGameState(state => {
        return {
          ...state,
          students: [...studentsArray]
        }
      })
    })
    return () => newSocket.close()
  }, [initialState, setGameState])

  function createRoom() {
    socket.emit('create-room', (masterId, roomNumber, students) => {
      setGameState({ masterId, roomNumber, students })
    })
  }



  let toPrint = ''
  if (socket == null) {
    toPrint = <div>Conectando ...</div>
  } else if (gameState.roomNumber === '') {
    toPrint = (
      <div>
        <button type='submit' onClick={createRoom}>Generar sala</button>
      </div>
    )
  } else {
    toPrint = (
      <div>
        Inicializando, masterd id: {gameState.masterId} <br />
        Sala número {gameState.roomNumber} <br />
        Conectados: <br />
        <ul>
          {gameState.students.map(student => (
            <li key={student.id}>{student.name} - {student.nameApproved.toString()}</li>
          ))}
          <li>En proceso...</li>
        </ul>
      </div>
    )
  }

  return <div className="App">{toPrint}</div>
}

export default App