import { useSession } from "../contexts/SessionProvider"
import Cards from "./Cards"

export default function GameBoard() {
    const session = useSession()
    switch (session.status) {
        case "playing":
            return <Cards />
        default:
            return <div>oops...</div>
    }
}