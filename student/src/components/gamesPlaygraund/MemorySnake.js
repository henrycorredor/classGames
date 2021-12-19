/*
	cardsOnBoard: this.props.fullDeck,
	clicked: this.props.clicked,
	points: this.props.points,
	snake: this.snake
*/
import { useEffect, useState } from "react"
import { useGameStateContext } from "../../contexts/GameStateProvider"
import { useSocket } from "../../contexts/SocketProvider"

export default function MemorySnake() {
	const { gameState } = useGameStateContext()
	const [mensaje, setMensaje] = useState('')
	const socket = useSocket()

	const { props } = gameState.game

	// 1 select card to follow the snake
	// 2 select new card to add to the snake
	// 3 wait the user to pass the turn
	// 4 game ended

	useEffect(() => {
		let message = ''
		switch (props.status) {
			case 1:
				message = gameState.user.rol === 'myTurn' ? 'Te toca' : ''
				break
			case 2:
				message = gameState.user.rol === 'myTurn' ? 'Selecciona una nueva carta' : ''
				break
			case 3:
				message = (props.clicked.some(c => c.type === 'wrong')) ? 'Oh oh... equivocado' : '¡Preparado para el siguiente!'
				break
			default:
				message = 'oops... algo salió mal'
		}
		setMensaje(message)
	}, [
		props.status,
		gameState.user.rol,
		props.clicked
	])

	function hitCard(i) {
		if (gameState.user.rol === 'myTurn' && props.status !== 3) {
			socket.emit('action-1', { index: i })
		}
	}

	function cards() {
		return props.fullDeck.map((c, i) => {
			let classTag = 'card'
			if (props.clicked.some(c => c.index === i)) {
				classTag += ' card-selected'
			} else {
				classTag += ' card-no-selected'
			}

			const thisSelection = props.clicked.filter(c => c.index === i)
			if (thisSelection.some(c => c.type === 'wrong')) classTag += ' wrong'

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
	}

	function nextTurn() {
		socket.emit('action-2')
	}

	return (
		<div className='cards-playground'>
			{(mensaje !== '' && gameState.user.rol === 'myTurn') && <div className='warning-box'>{mensaje}</div>}
			{(props.status === 3 && gameState.user.rol === 'myTurn') && <button onClick={nextTurn} className='b3'>Siguiente</button>}
			<div className='cards-box'>
				{cards()}
			</div>
		</div>
	)
}