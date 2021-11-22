const express = require('express')
const app = express()
const server = require('http').createServer(app)

const ioServer = require('./sockets')

app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', (req, res) => {
	res.render('index', { probando: 'hola zoquetes' })
})

ioServer(server)

server.listen(3001, () => {
	console.log('Oyendo puerto 3001')
})