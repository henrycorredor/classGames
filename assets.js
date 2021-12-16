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
	state: Number,
	room: Number,
	users: Array[Client user list]
	game: gameObject
}

Students

1. Input room and name
2. Waits
3. Play
4. End

------------------------------------

-- CLIENT OBJECTS --

Game Object:
{}

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

*/