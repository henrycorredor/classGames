import { useGameContext } from "../contexts/GameSessionProvider";

export default function WaitingClassmates() {
	const { gameSession } = useGameContext()

	const names = gameSession.students.map((s) => gameSession.settings.showStudentsName ? s.name : '')

	return (
		<div className='one-input-form'>
			<div className='golden-board'>Espera un momento...</div>
			<div className='student-list'>
				{gameSession.students.map((s, i) => {
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