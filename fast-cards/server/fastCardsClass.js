class gameControls {
	constructor(numberOfCardsOnBoard = 4) {
		this.fullDeck = ['carta 1', 'carta 2', 'carta 3', 'carta 4', 'carta 5', 'carta 6', 'carta 7', 'carta 8', 'carta 9', 'carta 10']
		this.randomList = []
		this.randomSelection = []
		this.rightAnswer = 0
		this.rightAnswers = []
		this.clicked = []
		this.points = 0
		this.gameState = 1
		this.cardsOnBoard = numberOfCardsOnBoard
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
		for (let i = 0; i < this.cardsOnBoard; i++) {
			if (this.randomList.length === 0) {
				this.setRandomSelection()
			}
			const actualNum = this.randomList.pop()
			this.randomSelection.push(this.fullDeck[actualNum])
		}

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

	cardDeck() {
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