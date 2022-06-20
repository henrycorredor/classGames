import { useSession } from "../contexts/SessionProvider"
import { useSocket } from "../contexts/SocketProvider"

export default function Cards() {
    const { session } = useSession()
    const socket = useSocket()
    const { secuence, clickedSecuence, turnStatus } = session.game

    function statusBar() {
        const userIndex = session.players.findIndex(u => u.myTurn)
        const nextUser = userIndex === session.players.length - 1 ? 0 : userIndex + 1

        switch (turnStatus) {
            case 'waitingFirstClick':
                return (
                    session.myInfo.myTurn ?
                        `Seleccione la primera carta ` :
                        `${session.players[userIndex].name} va a seleccionar la primera carta.`
                )
            case 'hittedCorrect':
                return (
                    session.myInfo.myTurn ?
                        'Muy bien! Seleccione la siguiente' :
                        'Muy bien!'
                )
            case 'hittedWrong':
                return (
                    session.myInfo.myTurn ?
                        <button onClick={changeTurn}>Oh oh! incorrecto. Turno para {session.players[nextUser].name}</button> :
                        `Oh oh! incorrecto. Turno para ${session.players[nextUser].name}`
                )
            case 'lastCard':
                return (
                    session.myInfo.myTurn ?
                        'Muy bien! Agrege una carta nueva' :
                        'Muy bien! Una carta más'
                )
            case 'turnFinished':
                return (
                    session.myInfo.myTurn ?
                        <button onClick={changeTurn}> Muy bien! Turno para {session.players[nextUser].name}</button> :
                        `Muy bien! Turno para ${session.players[nextUser].name}`
                )
            default:
                return 'oops... hay un error'
        }
    }

    function counterBar() {
        return secuence.map((e, i) => {
            if (i >= clickedSecuence.length) {
                return <div className="circle waiting"></div>
            } else {
                if (clickedSecuence[i] === e) {
                    return (
                        turnStatus === 'turnFinished' && i === secuence.length - 1 ?
                            <div className="circle selectedNew"></div> :
                            turnStatus === 'lastCard' && i === secuence.length - 1 ?
                                <><div className="circle right"></div>  <div className="circle waitingNew"></div></> :
                                <div className="circle right"></div>
                    )
                } else {
                    return <div className="circle wrong"></div>
                }
            }
        })
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
                {session.myInfo.myTurn ? " - me toca" : ''}
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
                {session.players.map(item => <div key={item.id} className={item.myTurn ? item.id === session.myInfo.id ? 'myTurn' : 'othersTurn' : 'waiting'}>{item.name}</div>)}
            </div>
        </div>
    )
}