import { useState, useEffect } from "react"
import { useSocket } from '../../contexts/SocketProvider'
import { useGameStateContext } from '../../contexts/GameStateProvider'
import '../styles/CardsPlayground.css'

/*
game sub - status
1 - selecting cards
2 - round ends, teacher restars
*/

export default function CardsPlayground() {
	const { gameState, updateGameState } = useGameStateContext()
	const socket = useSocket()
	const [warning, setWarning] = useState('')

	const { user } = gameState
	const { props, settings, status } = gameState.game

	function hitCard(index) {
		if (props.clicked.every(c => c.id !== user.id)) {
			socket.emit('action-1', { userId: user.id, cardIndex: index })
		}
	}

	function nextRound() {
		console.log('manda otra vez')
		socket.emit('action-2')
	}

	useEffect(() => {
		switch (status) {
			case 1:
				setWarning('')
				break
			case 2:
				if (props.clicked.every(c => c.selection === props.rightAnswer)) {
					setWarning('¡Perfecto!')
				} else {
					setWarning('Oh oh... alguien seleccionó incorrectamente')
				}
				break
			case 3:
				updateGameState({ user: { status: 4 } })
				break
			default:
				setWarning('oh oh... algo ha salido mal')
		}
	}, [
		status,
		props.clicked,
		props.rightAnswer,
		updateGameState
	])

	function cards() {
		if (user.rol === 'student') {
			return props.cardsOnBoard.map((c, i) => {
				let classTag = 'card'
				if (props.clicked.some(c => c.id === user.id && c.selection === i)) {
					classTag += ' card-selected'
					if (status === 2) {
						classTag += i === props.rightAnswer ? ' right' : ' wrong'
					}
				} else {
					classTag += ' card-no-selected'
				}
				const picUrl = '../images/' + c.src
				return (
					<div
						className={classTag}
						onClick={() => hitCard(i)}
						key={i}>
						<img alt={'carta numero ' + i} src={picUrl} />
					</div>
				)
			})
		} else {
			const picUrl = '/images/' + props.cardsOnBoard[props.rightAnswer].src
			return (
				<>
					<div className='card'>
						<img className="cardPic" alt="tarjeta maestra" src={picUrl} />
					</div>
					{status === 2 && <button onClick={nextRound} className='b3'>Otra vez</button>}
				</>
			)
		}
	}

	function pointsBarStyle() {
		const percent = (300 * props.points) / settings.maxPoints
		return { width: Math.ceil(percent) + 35 }
	}

	function studentListClassName(studentId) {
		let className = 'student-name'

		const mySelection = props.clicked.filter(c => c.id === studentId)
		const isRight = mySelection[0] ? mySelection[0].selection === props.rightAnswer : null
		if (status === 1) {
			className += mySelection[0] ? ' selected' : ''
		} else {
			if (settings.showStudentChoises) {
				className += isRight ? ' right' : ' wrong'
			} else {
				className += ' selected'
			}
		}

		if (settings.showWhoIsFirst) {
			const firstRight = props.clicked.findIndex(s => s.isRight)
			if (firstRight >= 0) {
				const firstRightId = props.clicked[firstRight].id
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
				<div className='points-level-bar' style={pointsBarStyle()}><span>Puntos: {props.points}</span></div>
				<div className='points-box'> {props.points} / <span> {settings.maxPoints} </span> </div>
			</div>
			<div className='cards-box'>
				{cards()}
			</div>
			{warning && <div className='warning-box'>{warning}</div>}
			<div className='student-list'>
				{gameState.users.map((s) => (
					s.rol === 'student' &&
					<div className={studentListClassName(s.id)} key={s.id}>
						{(settings.showStudentsName) ? s.name : ''}
					</div>))}
			</div>
		</div>
	)
}