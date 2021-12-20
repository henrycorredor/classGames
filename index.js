require('dotenv').config()
const fs = require('fs')
const path = require('path')
const express = require('express')
const http = require('http')
const https = require('https')

const socketApp = require('./socketApp/server')
const app = express()
const httpApp = express()

const httpsOpts = {
	key: fs.readFileSync(path.join(__dirname, process.env.KEY_PATH)),
	cert: fs.readFileSync(path.join(__dirname, process.env.CERT_PATH))
}
const serverHttp = http.createServer(httpApp)
const serverHttps = https.createServer(httpsOpts, app)

serverHttp.listen(process.env.HTTP_PORT)
serverHttps.listen(process.env.HTTPS_PORT)

httpApp.use((req, res) => {
	res.redirect(`https://${req.headers.host}${req.url}`)
})

const io = require('socket.io')(serverHttps)
socketApp(io)

app.use('/master', express.static(path.join(__dirname, '/master/build')))
app.use('/master/static', express.static(path.join(__dirname, '/master/build/static')))

app.use('/', express.static(path.join(__dirname, '/student/build')))
app.use('/static', express.static(path.join(__dirname, '/student/build/static')))