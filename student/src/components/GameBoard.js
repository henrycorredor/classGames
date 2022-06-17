import { useSession } from "../contexts/SessionProvider"
import Cards from "./Cards"

export default function GameBoard() {
    const { session } = useSession()
    switch (session.status) {
        case "connecting":
            return <div>Conectando...</div>
        case "playing":
            return <Cards />
        default:
            return <div>oops...</div>
    }
}