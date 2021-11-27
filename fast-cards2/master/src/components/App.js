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


Master states
1 - Connecting
			- connected
2 - Waiting for students, accept, reject, select teachers
			- hit start button
3 - Playing
			- Server ends the game
4 - Game over


Server game session object
{
	game: {
		room: 28736,
		status: 1
	},
	master: {
		id: string,
		socket: string,
		status: 1
	},
	students:[
		{
			id: string,
			name: string,
			socket: string,
			online: true,
			accepted: true,
			rol: 'student'
			status: 1
		}
	]
}

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

Master object
{
	game:{
		room: 28736,
		status: 1,
		id: string
	},
	students: [
		id: string,
		name: string,
		online: true,
		rol: 'student'
	]
}
*/

import { GameSessionProvider } from '../contexts/GameSessionContext'
import { SocketProvider } from '../contexts/SocketContext'

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