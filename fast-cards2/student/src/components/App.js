/*
Player states
1 - Connecting
			- connected
2 - Input room number
			- Submited - joined room
3 - Input name
			- Submited - teacher approved
4 - Waiting for classmates
			- Teacher starts
5 - Playing
			- Game is over, server notifies
6 - Game over

Student game session object
{
	game:{
		room: 28736,
		status: 1
	},
	user: {
		id: string,
		name: string,
		rol: 'student'
	},
	students: [
		id: string,
		name: string,
		online: true,
		rol: 'student'
	]
}
*/

import { SocketProvider } from '../contexts/SocketProvider'
import { GameSessionProvider } from '../contexts/GameSessionProvider'
import GameDesktop from './GameDesktop'
import { CardsDeckProvider } from '../contexts/CardsDeckProvider';

function App() {
	return (
		<SocketProvider>
			<GameSessionProvider>
				<CardsDeckProvider>
					<GameDesktop />
				</CardsDeckProvider>
			</GameSessionProvider>
		</SocketProvider>
	);
}

export default App;
