import { useState, useEffect } from "react"
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
	const { cardsDeck, students, user, settings } = gameSession

	function hitCard(index) {
		if (cardsDeck.clicked.every(c => c.id !== user.id)) {
			socket.emit('hit-card', user.id, index)
		}
	}

	function nextRound() {
		socket.emit('next-round', (newCardsDeck) => {
			updateGameSession({ cardsDeck: newCardsDeck })
		})
	}

	useEffect(() => {
		console.log('estado: ', cardsDeck.gameState)
		switch (cardsDeck.gameState) {
			case 1:
				setWarning('')
				break
			case 2:
				if (cardsDeck.clicked.every(c => c.selection === cardsDeck.rightAnswer)) {
					setWarning('¡Perfecto!')
				} else {
					setWarning('Oh oh... alguien seleccionó incorrectamente')
				}
				break
			case 3:
				updateGameSession({ game: { status: 6 } })
				break
			default:
				setWarning('oh oh... algo ha salido mal')
		}
	}, [
		cardsDeck,
		updateGameSession
	])

	let cards
	if (user.rol === 'student') {
		cards = cardsDeck.randomSelection.map((c, i) => (
			<div onClick={() => hitCard(i)} key={i}>
				{c}
				{cardsDeck.clicked.some(c => c.id === user.id && c.selection === i) && ' - seleccionado'}
			</div>
		))
	} else {
		cards = (
			<div>{cardsDeck.randomSelection[cardsDeck.rightAnswer]} <br />
				{cardsDeck.gameState === 2 && <button onClick={nextRound}>Otra vez</button>}
			</div>
		)
	}

	function studentsSelections(studentId) {
		const mySelection = cardsDeck.clicked.filter(c => c.id === studentId)
		const isRight = mySelection[0] ? mySelection[0].selection === cardsDeck.rightAnswer : null
		if (cardsDeck.gameState === 1) {
			return mySelection[0] ? ' - seleccionado' : null
		} else {
			if (settings.showStudentChoises) {
				return isRight ? ' - correcto' : ' - incorrecto'
			} else {
				return ' - seleccionado'
			}
		}
	}

	return (
		<div>
			<div>Puntos: {cardsDeck.points}</div>
			<div>
				{cards}
			</div>
			{(warning) && <div>{warning}</div>}
			<ul>
				{students.map((s) => (
					s.rol === 'student' &&
					<li key={s.id}>
						{s.name}
						{studentsSelections(s.id)}
					</li>))}
			</ul>
		</div>
	)
}