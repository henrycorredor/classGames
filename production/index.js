const express = require('express')
const path = require('path')

const app = express()

app.use('/master', express.static(__dirname+'/master'))
app.use('/static', express.static(__dirname+'/master/static'))

app.use('/student', express.static(__dirname+'/student'))
app.use('/student/student/static',  express.static(__dirname+'/student/static'))

app.listen('3001')