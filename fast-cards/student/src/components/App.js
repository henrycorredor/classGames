import { SocketProvider } from '../contexts/SocketProvider'
import { GameSessionProvider } from '../contexts/GameSessionProvider'
import Layout from './Layout'
import GameDesktop from './GameDesktop'
import '../../node_modules/reseter.css/css/reseter.min.css'

function App() {
	return (
		<SocketProvider>
			<GameSessionProvider>
				<Layout>
					<GameDesktop />
				</Layout>
			</GameSessionProvider>
		</SocketProvider>
	);
}

export default App