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
                return `${session.players[userIndex].name}: Seleccione la primera carta `
            case 'hittedCorrect':
                return 'Muy bien! Seleccione la siguiente'
            case 'hittedWrong':
                return (
                    session.myInfo.myTurn ?
                        <button onClick={changeTurn}>Oh oh! incorrecto. Turno para {session.players[nextUser].name}</button> :
                        `Oh oh! incorrecto. Turno para ${session.players[nextUser].name}`
                )
            case 'lastCard':
                return 'Muy bien! Agrege una carta nueva'
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
        let outputText = 'Estado: '
        secuence.forEach((e, i) => {
            if (i >= clickedSecuence.length) {
                outputText += '0 '
            } else {
                if (clickedSecuence[i] === e) {
                    outputText += turnStatus === 'turnFinished' && i === secuence.length - 1 ? '!!' : 'V '
                } else {
                    outputText += 'X '
                }
            }
        })

        if (clickedSecuence.length === secuence.length && turnStatus === 'lastCard') {
            outputText += '.'
        }

        return outputText
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
            <div>
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
            <div>
                {statusBar()}
            </div>
            <div>
                {counterBar()}
            </div>
            <div>
                {session.players.map(item => <div key={item.id} className={item.myTurn ? 'myTurn' : 'waiting'}>{item.myTurn ? '-> ' : ''}{item.name}</div>)}
            </div>
        </div>
    )
}