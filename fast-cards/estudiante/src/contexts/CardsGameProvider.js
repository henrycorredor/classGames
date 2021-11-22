import { createContext, useContext, useEffect, useState } from "react"
import { useGameSession } from "./SessionProvider"

const CardsGameContext = createContext()

export function useCardsInfo() {
	return useContext(CardsGameContext)
}

function setNewTurn(cardsDeck) {
	const randomSelect = []
	do {
		const randomNumber = Math.floor(Math.random() * 10)
		if (!randomSelect.includes(randomNumber)) {
			randomSelect.push(randomNumber)
		}
	} while (randomSelect.length < 4)

	const rightAnswer = Math.floor(Math.random() * 10)

	return {
		randomSelection: randomSelect.map(index => cardsDeck[index]),
		rightAnswer
	}
}

export function CardsBoardProvider({ children }) {
	const [gameSession] = useGameSession()

	const [cardsDeck, setCardsDeck] = useState({
		fullDeck: [],
		randomSelection: [],
		rightAnswer: 0
	})
	const [selections, setSelections] = useState({})

	useEffect(() => {
		setCardsDeck(original => {
			const cardsDec = ['carta 1', 'carta 2', 'carta 3', 'carta 4', 'carta 5', 'carta 6', 'carta 7', 'carta 8', 'carta 9', 'carta 10']
			const firstTurn = setNewTurn(cardsDec)
			return {
				...original,
				fullDeck: [...cardsDec],
				...firstTurn
			}
		})
	}, [])

	function selectCard(selection, userId = gameSession.user.id) {
		if (!selections[userId]) {
			setSelections(original => {
				return { ...original, [userId]: selection }
			})
		}
	}

	return (
		<CardsGameContext.Provider value={{ cardsDeck, selections, selectCard }}>
			{children}
		</CardsGameContext.Provider>
	)
}

