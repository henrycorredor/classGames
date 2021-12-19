import { useGameStateContext } from '../contexts/GameStateProvider'
import './styles/Layout.css'

function Layout({ children }) {
	const { gameState } = useGameStateContext()

	return (
		<div id="container" className={gameState.user.rol}>
			{children}
		</div>
	)
}

export default Layout