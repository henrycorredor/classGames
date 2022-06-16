import './App.css';
import GameBoard from './components/GameBoard'
import { SessionProvider } from './contexts/SessionProvider'

function App() {
  return (
    <SessionProvider>
      <GameBoard />
    </SessionProvider>
  )
}

export default App