import { useGameContext } from '../contexts/GameSessionProvider'
import './styles/Layout.css'

function Layout({ children }) {
	const { gameSession } = useGameContext()

	function containerClass() {
		return gameSession.user.rol === 'student' ? 'student' : 'teacher'
	}

	return (
		<div id="container" className={containerClass()}>
			{children}
		</div>
	)
}

export default Layout