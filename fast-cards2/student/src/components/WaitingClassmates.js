import { useGameContext } from "../contexts/GameSessionProvider";

export default function WaitingClassmates() {
	const { gameSession } = useGameContext()

	const names = gameSession.students.map((s)=> gameSession.settings.showStudentsName ? s.name : '-')

	return (
		<div>
			{gameSession.user.id} 
			<div>Espera un momento...</div>
			<ul>
				{gameSession.students.map((s,i) => {
					return (
						<li key={s.id}>{names[i]}{(s.rol === 'teacher') ? ' - el profe' : null}</li>
					)
				})}
			</ul>
		</div>
	)
}