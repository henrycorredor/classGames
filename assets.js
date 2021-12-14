/*
Server game session object
{
	room-4345: {
		game: string,
		master: {
			socket: string,
			status: 1,
			online: true
		},
		waiting: [
			{
				id: string,
				name: string,
				socket: string,
				status: number,
				online: Boolean
			}
		],
		students:[
			{
				id: string,
				name: string,
				socket: string,
				online: true,
				rol: 'student'
				status: 1
			}
		],
		settings: {
			showStudentsName: Boolean, 			//default: true
			maxPoints: Number,							//default: 10
			showStudentChoises: Boolean,		//default: true
			teachersTakeTurns: Boolean,			//default: false
			showWhoIsFirst: Boolean					//default: true
			timeLimit: Number								//default: 0
		}
	}
}


Cards deck instance
{
	fullDeck: Array[10],
	randomSelection: Array[4],
	rightAnswer: Number,
	clicked: [{id: String, selection: Number, isRight: Boolean}],
	points: Number,
	gameState: 1
}

*/

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
	],
	cardsDeck: {
		randomSelection: [Array 4],
		rightAnswer: Number,
		clicked: [Array] //[{id: String, selection: number, isRight: Boolean}],
		points: Number,
		gameState: 0
	},
	setttings: {
		showStudentsName: Boolean,
		maxPoints: Number,	
		showStudentChoises: Boolean,	
		teachersTakeTurns: Boolean,	
		showWhoIsFirst: Boolean	
		timeLimit: Number
	}
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
	],
	waiting: [
		{
			id: string,
			name: string,
			socket: string
		}
	],
	settings: {
		showStudentsName: Boolean, 			//default: true
		maxPoints: Number,							//default: 10
		showStudentChoises: Boolean,		//default: true
		teachersTakeTurns: Boolean,			//default: false
		showWhoIsFirst: Boolean					//default: true
		timeLimit: Number								//default: 0
	}
}
*/