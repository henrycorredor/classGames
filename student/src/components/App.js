import { SocketProvider } from '../contexts/SocketProvider'
import { GameStateProvider } from '../contexts/GameStateProvider'
import Layout from './Layout'
import GameDesktop from './GameDesktop'
import '../../node_modules/reseter.css/css/reseter.min.css'

function App() {
	return (
		<SocketProvider>
			<GameStateProvider>
				<Layout>
					<GameDesktop />
				</Layout>
			</GameStateProvider>
		</SocketProvider>
	);
}

export default App