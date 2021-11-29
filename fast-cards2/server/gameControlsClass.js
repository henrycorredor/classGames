class gameControls {
	constructor() {
		this.fullDeck = ['carta 1', 'carta 2', 'carta 3', 'carta 4', 'carta 5', 'carta 6', 'carta 7', 'carta 8', 'carta 9', 'carta 10']
		this.randomSelection = []
		this.rightAnswer = 0
		this.clicked = []
		this.points = 0
	}

	setNewTurn() {
		const randomSelect = []
		do {
			const randomNumber = Math.floor(Math.random() * 10)
			if (!randomSelect.includes(randomNumber)) {
				randomSelect.push(randomNumber)
			}
		} while (randomSelect.length < 4)

		const rightAnswer = Math.floor(Math.random() * 4)

		this.randomSelection = randomSelect.map(index => this.fullDeck[index])
		this.rightAnswer = rightAnswer

		return {
			randomSelection: this.randomSelection,
			rightAnswer: this.rightAnswer,
			clicked: this.clicked,
			points: this.points
		}
	}

	hitCard(userId, cardIndex) {
		if (this.clicked.every(id => id !== userId))
			this.clicked.push({ id: userId, selection: cardIndex })
	}

	cardDeck() {
		return {
			randomSelection: this.randomSelection,
			rightAnswer: this.rightAnswer,
			clicked: this.clicked,
			points: this.points
		}
	}
}

module.exports = gameControls