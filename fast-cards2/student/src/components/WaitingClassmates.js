import { useGameContext } from "../contexts/GameSessionProvider";

export default function WaitingClassmates() {
	const { gameSession } = useGameContext()

	return (
		<div>
			{gameSession.user.id} 
			<div>Espera un momento...</div>
			<ul>
				{gameSession.students.map(s => {
					return (
						<li key={s.id}>{s.name}{(s.rol === 'teacher') ? ' - el profe' : null}</li>
					)
				})}
			</ul>
		</div>
	)
}