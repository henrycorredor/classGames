import { SocketProvider } from '../contexts/SocketProvider'
import { GameSessionProvider } from '../contexts/GameSessionProvider'
import GameDesktop from './GameDesktop'

function App() {
	return (
		<SocketProvider>
			<GameSessionProvider>
				<GameDesktop />
			</GameSessionProvider>
		</SocketProvider>
	);
}

export default App;
