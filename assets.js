/*

-- STATES --

Master

0. Not connected
1. Choose game, set settings -> open room
2. Wait students, moderate (reject users, select teacher) -> start game
3. Playing
4. Game ends -> again

Object

{
	status: Number,
	room: Number,
	users: [{
		id: string,
		name: string,
		online: true,
		rol: 'student'
	}],
	game: {
		name: String,
		id: String,
		status: Number,
		settings: {
			needTeacher: Boolean,
			showStudentsName: Boolean
		}
	}
}

--//--

Users

1. Input room and name
2. Waits
3. Play
4. End

Object

{
	game: {
		room: '',
		status: 0,
		id: '',
		settings: '',
		props: ''
	},
	user: {
		id: '',
		name: '',
		rol: 'student',
		status: 0
	},
	users: []
}

------------------------------------

-- USER LIST ARRAY OBJECTS --

Client users List:

[{
	id: string,
	name: string,
	online: true,
	rol: 'student'
}]


Server Userlist

[{
	id: string,
	name: string,
	online: true,
	rol: 'student'
	socket: string,
	status: 1
}]

---------------------------

-- SERVER > ROOMS --

{
	master:{
		socket: String,
		status: Number,
		online: boolean
	},
	users:{
		status: Number,
		list:[{
			id: string,
			name: string,
			online: true,
			rol: 'student'
			socket: string
		}]
	},
	game: class Instance{
		settings: {
			needTeacher: Boolean,
			showStudentsName: Boolean
		},
		id: String,
		name: String,
		props: Object
	}
}

----------------------------*/


/*
Fast Cards props

constructor(gameOpts) {
		this.settings = {
			needTeacher: true,
			numberOfCardsOnBoard: 4,
			maxPoints: 10,
			showStudentsName: true,
			showStudentChoises: true,
			showWhoIsFirst: true
		}
		this.status = 0
		this.id = gameOpts.id
		this.name = gameOpts.name
		this.props = {
			fullDeck: [],
			randomNumbersList: [],
			cardsOnBoard: [],
			rightAnswer: 0,
			clicked: [],
			points: 0
		}
	}

*/