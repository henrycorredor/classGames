class memorySnake {
	constructor(gameOpts) {
		this.settings = gameOpts.settings
		this.id = gameOpts.id
		this.name = gameOpts.name
		this.clickedIndex = 0
		this.props = {
			fullDeck: [
				{ type: 'picture', src: 'frutas/fresa.jpg' },
				{ type: 'picture', src: 'frutas/sandia.jpg' },
				{ type: 'picture', src: 'frutas/banana.jpg' },
				{ type: 'picture', src: 'frutas/pera.jpg' },
				{ type: 'picture', src: 'frutas/mango.jpg' },
				{ type: 'picture', src: 'frutas/naranja.jpg' },
			],
			status: 0,
			snake: [],
			clicked: [],
			points: 0,
			turnIndex: 0
		}
	}

	// status:
	// 1 select card to follow the snake
	// 2 select new card to add to the snake
	// 3 wait the user to pass the turn
	// 4 game ended

	//hit card
	action1(opts, room, reportUpdate) {
		if (this.props.status === 2) {
			this.props.snake.push(opts.index)
			this.props.clicked.push({ index: opts.index, type: 'new' })
			this.props.status = 3
		} else {
			if (opts.index === this.props.snake[this.clickedIndex]) {
				this.props.clicked.push({ index: opts.index, type: 'right' })
				this.clickedIndex++
				if (this.clickedIndex === this.props.snake.length) {
					this.props.status = 2
					if (this.props.snake.length === Number(this.settings.maxPoints)) {
						this.props.status = 4
						room.users.status = 4
						room.master.status = 4
					}
				}
			} else {
				this.props.clicked.push({ index: opts.index, type: 'wrong' })
				this.props.status = 3
			}
		}
		reportUpdate()
	}

	//next turn
	action2(opts, room, reportUpdate) {
		let turnIndex = room.users.list.findIndex(u => u.rol === 'myTurn')
		turnIndex++
		if (turnIndex === room.users.list.length) turnIndex = 0

		room.users.list.forEach(s => s.rol = 'wait')
		room.users.list[turnIndex].rol = 'myTurn'

		this.props.clicked = []
		this.clickedIndex = 0

		this.props.status = this.props.snake.length === 0 ? 2 : 1
		reportUpdate()
	}

	getProps() {
		return { ... this.props }
	}
}

module.exports = memorySnake