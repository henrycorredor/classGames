import { CardsBoardProvider, useCardsInfo } from "../contexts/CardsGameProvider";
import { useGameSession } from '../contexts/SessionProvider'

export default function CardsBoard() {
	const { cardsDeck, selections, selectCard } = useCardsInfo()
	const [{ classMates }] = useGameSession()
	console.log(classMates, 'los compañeros')
	return (
		<CardsBoardProvider>
			<div className="cards">
				{cardsDeck.randomSelection.map((card, index) => <div key={index} onClick={() => { selectCard(index) }}>{card}</div>)}
			</div>
			<div>
				{classMates.map(user => (
					<div>{user.name}
						{(selections[user.id]) ? 'seleccionó' : null}
					</div>
				))}
			</div>
		</CardsBoardProvider>
	)
}
