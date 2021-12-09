import { useState, useEffect } from "react"
import { useSocket } from '../contexts/SocketProvider'
import { useGameContext } from '../contexts/GameSessionProvider'
import './styles/CardsPlayground.css'

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
		if (user.rol === 'student') {
			return cardsDeck.randomSelection.map((c, i) => {
				let classTag = 'card'
				if (cardsDeck.clicked.some(c => c.id === user.id && c.selection === i)) {
					classTag += ' card-selected'
					if (cardsDeck.gameState === 2) {
						classTag += i === cardsDeck.rightAnswer ? ' right' : ' wrong'
					}
				} else {
					classTag += ' card-no-selected'
				}
				return (
					<div
						className={classTag}
						onClick={() => hitCard(i)}
						key={i}>
						{c}
					</div>
				)
			})
		} else {
			return (
				<>
					<div className='card'>{cardsDeck.randomSelection[cardsDeck.rightAnswer]}</div>
					{cardsDeck.gameState === 2 && <button onClick={nextRound} className='b3'>Otra vez</button>}
				</>
			)
		}
	}

	function pointsBarStyle() {
		const percent = (300 * cardsDeck.points) / settings.maxPoints
		return { width: Math.ceil(percent) + 35 }
	}

	function studentListClassName(studentId) {
		let className = 'student-name'

		const mySelection = cardsDeck.clicked.filter(c => c.id === studentId)
		const isRight = mySelection[0] ? mySelection[0].selection === cardsDeck.rightAnswer : null
		if (cardsDeck.gameState === 1) {
			className += mySelection[0] ? ' selected' : ''
		} else {
			if (settings.showStudentChoises) {
				className += isRight ? ' right' : ' wrong'
			} else {
				className += ' selected'
			}
		}

		if (settings.showWhoIsFirst) {
			const firstRight = cardsDeck.clicked.findIndex(s => s.isRight)
			if (firstRight >= 0) {
				const firstRightId = cardsDeck.clicked[firstRight].id
				if (firstRightId === studentId) className += ' first'
			}
		}

		if (!settings.showStudentsName) {
			className += ' no-name'
		}

		return className
	}

	return (
		<div className='cards-playground'>
			<div className='points-bar'>
				<div className='points-level-bar' style={pointsBarStyle()}><span>Puntos: {cardsDeck.points}</span></div>
				<div className='points-box'> {cardsDeck.points} / <span> {settings.maxPoints} </span> </div>
			</div>
			<div className='cards-box'>
				{cards()}
			</div>
			{warning && <div className='warning-box'>{warning}</div>}
			<div className='student-list'>
				{students.map((s) => (
					s.rol === 'student' &&
					<div className={studentListClassName(s.id)} key={s.id}>
						{(settings.showStudentsName) ? s.name : ''}
					</div>))}
			</div>
		</div>
	)
}