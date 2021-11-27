/*
Server game session object
{
	room-4345:{
		master: {
			socket: string,
			status: 1
		},
		students:[
			{
				id: string,
				name: string,
				socket: string,
				online: true,
				approved: true,
				rol: 'student'
				status: 1
			}
		]
}



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


Master states
1 - Connecting
			- connected
2 - Create room button
			- hit create button, gets room ID
3 - Waiting for students, accept, reject, select teachers
			- hit start button
4 - Playing
			- Server ends the game
5 - Game over


Master object
{
	room: 28736,
	status: 1,
	students: [
		id: string,
		name: string,
		online: true,
		rol: 'student',
		approved: false
	]
}
*/

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