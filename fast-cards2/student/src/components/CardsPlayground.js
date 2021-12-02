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

	function cards() {
		console.log('refresca baraja, mi rol ', user.rol)
		if (user.rol === 'student') {
			return cardsDeck.randomSelection.map((c, i) => (
				<div onClick={() => hitCard(i)} key={i}>
					{c}
					{cardsDeck.clicked.some(c => c.id === user.id && c.selection === i) && ' - seleccionado'}
				</div>
			))
		} else {
			return (
				<div>{cardsDeck.randomSelection[cardsDeck.rightAnswer]} <br />
					{cardsDeck.gameState === 2 && <button onClick={nextRound}>Otra vez</button>}
				</div>
			)
		}
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

	function amIFirst(id) {
		if (settings.showWhoIsFirst) {
			const firstRight = cardsDeck.clicked.findIndex(s => s.isRight)
			console.log('se puede mostrar el primero', firstRight)
			if (firstRight >= 0) {
				const firstRightId = cardsDeck.clicked[firstRight].id
				if (firstRightId === id) return ' - ¡Primero!'
			}
		}
		return ''
	}

	return (
		<div className='d-flex flex-column justify-content-between h-100 align-items-center'>
			<div>Puntos: {cardsDeck.points}</div>
			<div>
				{cards()}
			</div>
			{(warning) && <div>{warning}</div>}
			<div className=''>
				{students.map((s) => (
					s.rol === 'student' &&
					<div key={s.id}>
						{s.name}
						{studentsSelections(s.id)}
						{amIFirst(s.id)}
					</div>))}
			</div>
		</div>
	)
}