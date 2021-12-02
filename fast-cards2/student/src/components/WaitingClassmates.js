import { useGameContext } from "../contexts/GameSessionProvider";
import './styles/WaitingClassmates.css'

export default function WaitingClassmates() {
	const { gameSession } = useGameContext()

	const names = gameSession.students.map((s) => gameSession.settings.showStudentsName ? s.name : '-')

	return (
		<div className='col-6 text-center'>
			<div>Espera un momento...</div>
			<div className='d-flex flex-wrap justify-content-around pt-5'>
				{gameSession.students.map((s, i) => {
					const myClass = (s.rol === 'teacher') ? 'students-names pb-3 fw-bold' : 'students-names pb-3'
					return (
						<div
							className={myClass}
							key={s.id}
						>
							{names[i]}
							{(s.rol === 'teacher') && <div className='form-text'>el profe</div>}
						</div>
					)
				})}
			</div>
		</div>
	)
}