import { GameSessionProvider } from '../contexts/GameSessionProvider'
import { SocketProvider } from '../contexts/SocketProvider'
import GameBoard from '../components/GameBoard'
import Layout from './Layout'
function App() {
	return (
		<SocketProvider>
			<GameSessionProvider>
				<Layout>
					<GameBoard />
				</Layout>
			</GameSessionProvider>
		</SocketProvider>
	)
}

export default App