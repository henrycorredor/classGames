import { useSession } from "../contexts/SessionProvider"

export default function Cards() {
    const { session, updateSession } = useSession()
    const { secuence, clickedSecuence, turnStatus } = session.game

    console.log(session)

    function statusBar() {
        const userIndex = session.players.findIndex(u => u.myTurn)
        const nextUser = userIndex === session.players.length - 1 ? 0 : userIndex + 1

        switch (turnStatus) {
            case 'waitingFirstClick':
                return `${session.players[userIndex].name}: Seleccione la primera carta `
            case 'hittedCorrect':
                return 'Muy bien! Seleccione la siguiente'
            case 'hittedWrong':
                return <button onClick={changeTurn}>Oh oh! incorrecto. Turno para {session.players[nextUser].name}</button>
            case 'lastCard':
                return 'Muy bien! Agrege una carta nueva'
            case 'turnFinished':
                return <button onClick={changeTurn}> Muy bien! Turno para {session.players[nextUser].name}</button>
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
        if (turnStatus !== 'turnFinished' && turnStatus !== 'hittedWrong') {
            gameControl(card)
        }
    }

    function changeTurn() {
        const turnIndex = session.players.findIndex(p => p.myTurn)
        const nextTurn = (turnIndex === session.players.length - 1) ? 0 : turnIndex + 1
        const newPlayersList = session.players.map((p, i) => {
            return {
                ...p,
                myTurn: i === nextTurn
            }
        })

        updateSession({
            players: [...newPlayersList],
            game: {
                clickedSecuence: [],
                turnStatus: 'waitingFirstClick'
            }
        })
    }

    function gameControl(card) {
        const updateObj = {}
        if (secuence.length === clickedSecuence.length) {
            updateObj.game = {
                clickedSecuence: [...clickedSecuence, card],
                secuence: [...secuence, card],
                turnStatus: 'turnFinished'
            }
        } else if (secuence.length - 1 === clickedSecuence.length) {
            updateObj.game = {
                turnStatus: (secuence[clickedSecuence.length] === card) ? 'lastCard' : "hittedWrong",
                clickedSecuence: [...clickedSecuence, card]
            }
        } else if (secuence.length > clickedSecuence.length) {
            updateObj.game = {
                turnStatus: (secuence[clickedSecuence.length] === card) ? "hittedCorrect" : "hittedWrong",
                clickedSecuence: [...clickedSecuence, card]
            }
        }

        updateSession(updateObj)
    }

    return (
        <div>
            <div>{session.myInfo.name} - {session.myInfo.id}</div>
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