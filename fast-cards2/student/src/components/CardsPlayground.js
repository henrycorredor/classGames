import { useGameDeck } from "../contexts/CardsDeckProvider"

export default function CardsPlayground() {
	const { cardsDeck } = useGameDeck()

	if (cardsDeck === '') {
		return <div>Un momento por favor...</div>
	} else {
		return (
			<div>
				Las cartas:
				<ul>
					{cardsDeck.randomSelection.map((c, i) => <li key={i}>{c}</li>)}
				</ul>
			</div>
		)
	}
}