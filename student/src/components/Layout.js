import { useGameStateContext } from '../contexts/GameStateProvider'
import './styles/Layout.css'

function Layout({ children }) {
	const { gameState } = useGameStateContext()

	function containerClass() {
		return gameState.user.rol === 'student' ? 'student' : 'teacher'
	}

	return (
		<div id="container" className={containerClass()}>
			{children}
		</div>
	)
}

export default Layout