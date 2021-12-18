import { useGameStateContext } from "../contexts/GameStateProvider";

export default function WaitingClassmates() {
	const { gameState } = useGameStateContext()

	const names = gameState.users.map((s) => gameState.game.settings.showStudentsName ? s.name : '')

	return (
		<div className='one-input-form'>
			<div className='golden-board'>Espera un momento...</div>
			<div className='student-list'>
				{gameState.users.map((s, i) => {
					const myClass = (s.rol === 'teacher') ? 'student-name teacher' : 'student-name'
					return (
						<div
							className={myClass}
							key={s.id}
						>
							{names[i]}
							{(s.rol === 'teacher') && <div className='profe-tag'> Profe</div>}
						</div>
					)
				})}
			</div>
		</div>
	)
}