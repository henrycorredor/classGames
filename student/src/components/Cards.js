import { useSession } from "../contexts/SessionProvider"

export default function Cards() {
    const session = useSession()
    const { secuence, clickedSecuence, turnStatus } = session.game

    function statusBar() {
        const userIndex = session.players.findIndex(u => u.myTurn)

        switch (turnStatus) {
            case 'waitingFirstClick':
                return `${session.players[userIndex].name}: Seleccione la primera carta `
            case 'hittedCorrect':
                return 'Muy bien! Seleccione la siguiente'
            case 'hittedWrong':
                return `Oh oh... incorrecto ${<button onClick={changeTurn} value={'Turno para ' + session.players[userIndex].name} />}`
            case 'lastCard':
                return 'Agrege una carta nueva'
            case 'turnFinished':
                return <button onClick={changeTurn} value={`Muy bien! Siguiente!`} />
            default:
                return 'oops... hay un error'
        }
    }
    
    function counterBar() {
        let outputText = 'Aqui vamos: '
        secuence.forEach((e, i) => {
            if (i < clickedSecuence.length - 1) {
                outputText += '| '
            } else {
                outputText += '0 '
            }
        })
        return outputText
    }

    function changeTurn(){
        console.log('miau')
    }

    function handleClick(card) {
        document.querySelectorAll('.card').forEach(e => e.classList.remove('selected'))
        document.getElementById('card' + card).classList.add('selected')
        gameControl(card)
    }

    function gameControl(card) {
        
    }

    return (
        <div>
            <div className='cards_deck'>
                {session.game.deck.map((item, index) => <div key={index} className="card" id={'card' + index} onClick={() => handleClick(index)}>{item}</div>)}
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