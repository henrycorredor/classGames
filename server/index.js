const express = require('express')
const cors = require('cors')

const app = express()
const server = require('http').createServer(app)

app.use(cors())

const { Server } = require("socket.io")
const { on } = require('events')
const { isGeneratorFunction } = require('util/types')
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

    //handle user connection

    console.log('a user connected')

    const playerId = gameSession.players.length === 0 ? 1 : gameSession.players[gameSession.players.length - 1].id + 1
    const myInfo = {
        id: playerId,
        name: `Jugador ${playerId}`,
        myTurn: playerId === 1
    }

    gameSession.players.push(myInfo)

    io.emit('gameObj', gameSession)
    socket.emit('myInfo', myInfo)

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

        if (gameSession.players.length === 0) {
            gameSession.game.secuence = []
        }
        io.emit('gameObj', gameSession)
    })

    socket.on('update-my-info', (cb) => {
        const myIndex = gameSession.players.findIndex(p => p.id === playerId)
        cb(gameSession.players[myIndex])
    })

    //game controls
    socket.on('click-on-card', (card) => {
        if (gameSession.game.secuence.length === gameSession.game.clickedSecuence.length) {
            gameSession.game.clickedSecuence = [...gameSession.game.clickedSecuence, card]
            gameSession.game.secuence = [...gameSession.game.secuence, card]
            gameSession.game.turnStatus = 'turnFinished'

        } else if (gameSession.game.secuence.length - 1 === gameSession.game.clickedSecuence.length) {
            gameSession.game.turnStatus = (gameSession.game.secuence[gameSession.game.clickedSecuence.length] === card) ? 'lastCard' : "hittedWrong"
            gameSession.game.clickedSecuence = [...gameSession.game.clickedSecuence, card]

        } else if (gameSession.game.secuence.length > gameSession.game.clickedSecuence.length) {
            gameSession.game.turnStatus = (gameSession.game.secuence[gameSession.game.clickedSecuence.length] === card) ? "hittedCorrect" : "hittedWrong"
            gameSession.game.clickedSecuence = [...gameSession.game.clickedSecuence, card]
        }

        io.emit('gameObj', gameSession)
    })

    socket.on('change-turn', () => {
        const turnIndex = gameSession.players.findIndex(p => p.myTurn)
        const nextTurn = (turnIndex === gameSession.players.length - 1) ? 0 : turnIndex + 1
        gameSession.game.clickedSecuence = []
        gameSession.game.turnStatus = 'waitingFirstClick'
        gameSession.players.forEach((p, i) => {
            p.myTurn = i === nextTurn
        })

        io.emit('gameObj', gameSession)
    })
})


server.listen(3000, () => {
    console.log('listening on 3000')
})