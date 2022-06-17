const express = require('express')
const cors = require('cors')

const app = express()
const server = require('http').createServer(app)

app.use(cors())

const { Server } = require("socket.io")
const io = new Server(server, {
    cors: {
        origin: '*'
    }
})

const gameSession = {
    status: "playing",
    players: [],
    game: {
        deck: ['1', '2', '3', '4'],
        secuence: [],
        clickedSecuence: [],
        turnStatus: 'waitingFirstClick'
    }
}

io.on('connection', (socket) => {
    console.log('a user connected')

    const playerId = gameSession.players.length === 0 ? 1 : gameSession.players[gameSession.players.length - 1].id + 1

    gameSession.players.push({
        id: playerId,
        name: `Jugador ${playerId}`,
        myTurn: playerId === 1
    })

    /*socket.emit('myId', {
        id: playerId,
        name: `Jugador ${playerId}`
    })*/

    io.emit('gameObj', gameSession)

    socket.on('disconnect', () => {
        console.log('user disconnected')
        const myIndex = gameSession.players.findIndex(p => p.id === playerId)

        if (gameSession.players[myIndex].myTurn) {
            console.log('es mi turno, se lo paso a otro')

            const nextPlayer = myIndex === gameSession.players.length - 1 ? 0 : myIndex + 1
            gameSession.players[nextPlayer].myTurn = true
            gameSession.game.clickedSecuence = []
        }

        gameSession.players.splice(myIndex, 1)

        io.emit('gameObj', gameSession)
    })
})

server.listen(3000, () => {
    console.log('listening on 3000')
})