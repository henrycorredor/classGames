const express = require('express')
const cors = require('cors')

const gameControl = require('./game_control')

const app = express()
const path = require('path');
const server = require('http').createServer(app)

app.use(cors())

const { Server } = require("socket.io")
const io = new Server(server, {
    cors: {
        origin: '*'
    }
})
gameControl(io)

app.use(express.static(path.join(__dirname, '/student/build')))
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/student/build', 'index.html'))
})

server.listen(3000, () => {
    console.log('listening on 3000')
})