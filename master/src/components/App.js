import { GameStateProvider } from '../contexts/GameStateProvider'
import { SocketProvider } from '../contexts/SocketProvider'
import GameBoard from '../components/GameBoard'
import Layout from './Layout'
function App() {
	return (
		<SocketProvider>
			<GameStateProvider>
				<Layout>
					<GameBoard />
				</Layout>
			</GameStateProvider>
		</SocketProvider>
	)
}

export default App