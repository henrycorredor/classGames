import { useEffect, useState } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import io from 'socket.io-client'
import { stringify } from 'querystring'

function App() {
  const stateOb = {
    masterId: '',
    roomNumber: '',
    students: []
  }

  const [sessionInfo, setSessionInfo] = useLocalStorage('game-session', stateOb)
  const [initialState] = useState(sessionInfo)

  useEffect(() => {
    const params = {
      query: {
        id: (!initialState.masterId) ? '' : initialState.masterId,
        roomNumber: (!initialState.roomNumber) ? '' : initialState.roomNumber
      }
    }
    const socket = io('http://localhost:3000/master', params)

    socket.on('connect', () => {

      socket.on('register-game-session', (data) => {
        setSessionInfo(data)
      })

      socket.on('new-name-income', ({ studentName, studentId }) => {
        setSessionInfo(actualSession => {
          return {
            ...actualSession,
            students: [
              ...actualSession.students,
              [{ studentName, studentId, approvedName: false }]
            ]
          }
        })
      })

      socket.on('student-join', (studentList) => {
        setSessionInfo(actualSession => {
          return {
            ...actualSession,
            students: studentList
          }
        })
      })
    })
    return () => socket.close()
  }, [initialState.masterId, initialState.roomNumber, setSessionInfo])

  return (
    <div className="App">
      Inicializando, masterd id: {sessionInfo.masterId} <br />
      Sala número {sessionInfo.roomNumber} <br />
      Conectados: <br />
      <ul>
        {sessionInfo.students.map(student => (
          <li key={student.id}>{student.name} - {stringify(student.nameApproved)}</li>
        ))}
        <li>En proceso...</li>
      </ul>
    </div>
  )
}

export default App