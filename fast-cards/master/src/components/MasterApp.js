import { GameSessionProvider } from '../contexts/GameSessionProvider'
import { SocketContextProvider } from '../contexts/SocketProvider'
import Dashboard from './Dashboard'
export default function MasterApp() {
  return (
    <SocketContextProvider>
      <GameSessionProvider>
        <Dashboard />
      </GameSessionProvider>
    </SocketContextProvider>
  )
}