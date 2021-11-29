import { useState, useRef, useEffect } from "react"
import { useSocket } from '../contexts/SocketProvider'
import { useGameContext } from '../contexts/GameSessionProvider'

/*
game sub - status
1 - selecting cards
2 - round ends, teacher restars
*/

export default function CardsPlayground() {
	const { gameSession, updateGameSession } = useGameContext()
	const socket = useSocket()
	const [warning, setWarning] = useState('')
	const [rounds, setRounds] = useState(1)
	const hitted = useRef('')
	const { cardsDeck, students, user } = gameSession

	function hitCard(index) {
		if (cardsDeck.clicked.every(c => c.id !== user.id) && hitted.current === '') {
			socket.emit('hit-card', user.id, index)
			hitted.current = index
		}
	}

	function nextRound() {
		socket.emit('next-round', (newCardsDeck) => {
			updateGameSession({ cardsDeck: newCardsDeck })
		})
	}

	useEffect(() => {
		if (cardsDeck.clicked.length === students.length - 1) {
			if (cardsDeck.points === 10) {
				updateGameSession({ game: { status: 6 } })
			} else {
				if (cardsDeck.clicked.every(c => c.selection === cardsDeck.rightAnswer)) {
					setWarning('¡Perfecto!')
				} else {
					setWarning('Oh oh... alguien seleccionó uno incorrecto')
				}
				setRounds(2)
			}
		} else {
			setWarning('')
			setRounds(2)
		}
	}, [cardsDeck, students, updateGameSession])

	let cards = ''
	if (user.rol === 'student') {
		cards = <ul>
			{cardsDeck.randomSelection.map((c, i) => {
				return (
					<li key={i} onClick={() => hitCard(i)}>
						{c}
						{(i === hitted.current) && ' - seleccionado'}
					</li>
				)
			})}
		</ul>
	} else {
		cards = <div>
			{cardsDeck.randomSelection[cardsDeck.rightAnswer]}
			{(rounds === 2) && <button onClick={nextRound}>¡Otra vez!</button>}
		</div>
	}

	return (
		<div>
			<div>Puntos: {cardsDeck.points}</div>
			{cards}
			{(warning) && <div>{warning}</div>}
			<ul>
				{students.map(s => {
					return (
						<li key={s.id}>
							{s.name}
							{(cardsDeck.clicked.some(c => c.id === s.id)) && ' - clicked'}
						</li>
					)
				})}
			</ul>
		</div>
	)
}