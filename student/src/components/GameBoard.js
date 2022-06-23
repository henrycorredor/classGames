import { useSession } from "../contexts/SessionProvider"
import Cards from "./Cards"
import InputName from "./InputName"
import { useTranslation } from "react-i18next"

export default function GameBoard() {
    const { session } = useSession()
    const { t } = useTranslation()
    switch (session.status) {
        case "connecting":
            return <div>{t('CONECTANDO')}</div>
        case "playing":
            if (session.myInfo.name === 'no-name') {
                return <InputName />
            } else {
                return <Cards />
            }
        default:
            return <div>oops...</div>
    }
}