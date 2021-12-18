//const studentListener = require('./fastCardsSocketLilsteners')

/*
needTeacher: true,
numberOfCardsOnBoard: 4,
maxPoints: 10,
showStudentsName: true,
showStudentChoises: true,
showWhoIsFirst: true
*/

class gameControls {
	constructor(gameOpts) {
		this.users = [] //{id: String, rol: String, online: Boolean}
		this.settings = gameOpts.settings
		this.status = 0
		this.id = gameOpts.id
		this.name = gameOpts.name
		this.props = {
			fullDeck: [
				{ type: 'picture', src: '01.png' },
				{ type: 'picture', src: '02.png' },
				{ type: 'picture', src: '03.png' },
				{ type: 'picture', src: '04.png' },
				{ type: 'picture', src: '05.png' },
				{ type: 'picture', src: '06.png' },
				{ type: 'picture', src: '07.png' },
				{ type: 'picture', src: '08.png' },
				{ type: 'picture', src: '09.png' },
				{ type: 'picture', src: '10.png' },
			],
			randomNumbersList: [],
			cardsOnBoard: [],
			rightAnswer: 0,
			clicked: [],
			points: 0
		}
	}

	setNewTurn(room) {
		this.props.cardsOnBoard = []
		room.master.status = 3
		do {

			if (this.props.randomNumbersList.length === 0) {

				do {
					const randomNumber = Math.floor(Math.random() * 10)
					if (!this.props.randomNumbersList.includes(randomNumber)) {
						this.props.randomNumbersList.push(randomNumber)
					}
				} while (this.props.randomNumbersList.length !== this.props.fullDeck.length)

			}

			const actualNum = this.props.randomNumbersList.pop()
			if (!this.props.cardsOnBoard.some(c => c.src === this.props.fullDeck[actualNum].src)) {
				this.props.cardsOnBoard.push(this.props.fullDeck[actualNum])
			}

		} while (this.props.cardsOnBoard.length !== Number(this.settings.numberOfCardsOnBoard))

		this.props.rightAnswer = Math.floor(Math.random() * Number(this.settings.numberOfCardsOnBoard))
		this.props.clicked = []
		this.status = 1

		return this.getProps()
	}

	//hit card
	action1({ userId, cardIndex }, room) {
		if (this.props.clicked.every(id => id !== userId)) {
			this.props.clicked.push({ id: userId, selection: cardIndex, isRight: cardIndex === this.props.rightAnswer })
			if (this.props.clicked.length === this.users.filter(u => u.online && u.rol === 'student').length) {
				this.status = 2
				if (this.props.clicked.every(c => c.isRight)) {
					++this.props.points
					console.log(this.props.points, this.settings.maxPoints)
					if (this.props.points === Number(this.settings.maxPoints)) {
						this.status = 3
						room.master.status = 4
						room.users.status = 4
					}
				}
			}
		}
	}

	//again
	action2(opts, room) {
		room.users.status = 4
		room.master.status = 4
		this.setNewTurn(room)
	}

	getProps() {
		return {
			cardsOnBoard: this.props.cardsOnBoard,
			rightAnswer: this.props.rightAnswer,
			clicked: this.props.clicked,
			points: this.props.points,
		}
	}
}

module.exports = gameControls