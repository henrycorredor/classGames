import './App.css';
import GameBoard from './components/GameBoard'
import { SessionProvider } from './contexts/SessionProvider'
import { SocketProvider } from './contexts/SocketProvider'

export default function App() {
  return (
    <SocketProvider>
      <SessionProvider>
        <GameBoard />
      </SessionProvider>
    </SocketProvider>
  )
}