import { useGameSession } from "../contexts/GameSessionProvider"
import CreateRoom from '../components/CreateRoom'
import StudentList from '../components/StudentsList'

export default function Dasboard() {
	const { gameSession } = useGameSession()

	if (!gameSession.roomNumber) {
		return <CreateRoom />
	} else {
		return <StudentList gameSession={gameSession} />
	}
}