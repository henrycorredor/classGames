//const studentListener = require('./fastCardsSocketLilsteners')

class gameControls {
	constructor(gameOpts) {
		this.fullDeck = ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png', '07.png', '08.png', '09.png', '10.png']
		this.randomList = []
		this.randomSelection = []
		this.rightAnswer = 0
		this.clicked = []
		this.points = 0
		this.gameState = 1
		this.cardsOnBoard = Number(gameOpts.settings.numberOfCardsOnBoard)
		this.settings = gameOpts.settings
		this.id = gameOpts.id
		this.name = gameOpts.name
		//studentListener(socket, this)
	}

	setRandomSelection() {
		do {
			const randomNumber = Math.floor(Math.random() * 10)
			if (!this.randomList.includes(randomNumber)) {
				this.randomList.push(randomNumber)
			}
		} while (this.randomList.length !== this.fullDeck.length)
	}

	setNewTurn() {
		this.randomSelection = []
		do {
			if (this.randomList.length === 0) {
				this.setRandomSelection()
			}
			const actualNum = this.randomList.pop()
			if (!this.randomSelection.includes(this.fullDeck[actualNum])) {
				this.randomSelection.push(this.fullDeck[actualNum])
			}
		} while (this.randomSelection.length !== this.cardsOnBoard)

		const rightAnswer = Math.floor(Math.random() * this.cardsOnBoard)

		this.rightAnswer = rightAnswer
		this.clicked = []
		this.gameState = 1

		return {
			randomSelection: this.randomSelection,
			rightAnswer: this.rightAnswer,
			clicked: this.clicked,
			points: this.points,
			gameState: this.gameState
		}
	}

	hitCard(userId, cardIndex) {
		if (this.clicked.every(id => id !== userId))
			this.clicked.push({ id: userId, selection: cardIndex, isRight: cardIndex === this.rightAnswer })
	}

	gameObj() {
		return {
			randomSelection: this.randomSelection,
			rightAnswer: this.rightAnswer,
			clicked: this.clicked,
			points: this.points,
			gameState: this.gameState
		}
	}
}

module.exports = gameControls