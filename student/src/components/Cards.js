import { useSession } from "../contexts/SessionProvider"
import { useSocket } from "../contexts/SocketProvider"
import { useTranslation } from "react-i18next"

/*
recursois para el diseño:
https://www.w3docs.com/snippets/html/how-to-make-a-div-fill-the-height-of-the-remaining-space.html
https://www.w3docs.com/tools/code-editor/10428
*/

export default function Cards() {
    const { session } = useSession()
    const socket = useSocket()
    const { secuence, clickedSecuence, turnStatus } = session.game

    const { t } = useTranslation()

    function statusBar() {
        const userIndex = session.players.findIndex(u => u.myTurn)
        const nextUser = userIndex === session.players.length - 1 ? 0 : userIndex + 1

        switch (turnStatus) {
            case 'waitingFirstClick':
                return (
                    session.myInfo.myTurn ?
                        t('SELECCIONE_LA_PRIMERA_CARTA') :
                        t('VA_A_SELECCIONAR_LA_PRIMERA_CARTA', { playerName: session.players[userIndex].name })
                )
            case 'hittedCorrect':
                return (
                    session.myInfo.myTurn ?
                        t('MUY_BIEN_SELECCIONE_LA_SIGUIENTE') :
                        t('MUY_BIEN')
                )
            case 'hittedWrong':
                return (
                    session.myInfo.myTurn ?
                        <button className="bigButton" onClick={changeTurn}>{t('OH_NO_INCORRECTO_TURNO_PARA')} {session.players[nextUser].name}</button> :
                        t('OH_NO_INCORRECTO_TURNO_PARA', { playerName: session.players[nextUser].name })
                )
            case 'lastCard':
                return (
                    session.myInfo.myTurn ?
                        t('MUY_BIEN_AGREGUE_UNA_CARTA_NUEVA') :
                        t('MUY_BIEN_UNA_CARTA_MAS')
                )
            case 'turnFinished':
                return (
                    session.myInfo.myTurn ?
                        <button className="bigButton" onClick={changeTurn}> {t('MUY_BIEN_TURNO_PARA', { playerName: session.players[nextUser].name })}</button> :
                        t('MUY_BIEN_TURNO_PARA', { playerName: session.players[nextUser].name })
                )
            default:
                return t('ERROR')
        }
    }

    function counterBar() {
        return secuence.map((e, i) => {
            if (i >= clickedSecuence.length) {
                return <div key={i} className="circle waiting"></div>
            } else {
                if (clickedSecuence[i] === e) {
                    return (
                        turnStatus === 'turnFinished' && i === secuence.length - 1 ?
                            <div key={i} className="circle selectedNew"></div> :
                            turnStatus === 'lastCard' && i === secuence.length - 1 ?
                                <div key={i} className="counterLastGroup"><div className="circle right"></div>  <div className="circle waitingNew"></div></div> :
                                <div key={i} className="circle right"></div>
                    )
                } else {
                    return <div key={i} className="circle wrong"></div>
                }
            }
        })
    }

    function playersList() {
        return (
            session.players.map(p => (
                <div key={p.id} className={p.myTurn ? p.id === session.myInfo.id ? 'myTurn' : 'othersTurn' : 'waiting'}>
                    {p.name === 'no-name' ? '???' : p.name}
                </div>
            ))
        )
    }

    function handleClick(card) {
        if (session.myInfo.myTurn) {
            if (turnStatus !== 'turnFinished' && turnStatus !== 'hittedWrong') {
                gameControl(card)
            }
        }
    }

    function changeTurn() {
        socket.emit('change-turn')
    }

    function gameControl(card) {
        socket.emit('click-on-card', card)
    }

    return (
        <div>
            <div id='head' className={session.myInfo.myTurn ? 'meToca' : ''}>
                {session.myInfo.name}
                {session.myInfo.myTurn ? ` - ${t('ME_TOCA')}` : ''}
            </div>
            <div className='cards_deck'>
                {session.game.deck.map(
                    (item, index) => (
                        <div
                            key={index}
                            className={clickedSecuence[clickedSecuence.length - 1] === index ? 'card selected' : 'card'}
                            id={'card' + index}
                            onClick={() => handleClick(index)}
                        >
                            {item}
                        </div>
                    )
                )}
            </div>
            <div id='status-bar'>
                {statusBar()}
            </div>
            <div id='counter-bar'>
                {counterBar()}
            </div>
            <div id='users-list-bar'>
                {playersList()}
            </div>
        </div>
    )
}