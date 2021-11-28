import { GameSessionProvider } from '../contexts/GameSessionProvider'
import { SocketProvider } from '../contexts/SocketProvider'
import GameBoard from '../components/GameBoard'

function App() {
	return (
		<SocketProvider>
			<GameSessionProvider>
				<GameBoard />
			</GameSessionProvider>
		</SocketProvider>
	)
}

export default App