require('dotenv').config()
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const massive = require('massive')
const session = require('express-session')
// const s3 = require('aws-sdk')
const ac = require('./controllers/authController')
const sc = require('./controllers/s3Controller')
// const bcrypt = require('bcrypt')

const app = express()
const server = http.Server(app)
const io = socketio(server)
const {SERVER_PORT, SESSION_SECRET, DB_STRING} = process.env

massive(DB_STRING).then(db => {
    app.set('db', db)
    console.log('DB connected!')
})

app.use(express.json())
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

app.post('/auth/login', ac.login)
app.post('/auth/register', ac.register)
app.get('/auth/logout', ac.logout)

app.get('/api/media/sign-s3', sc.getSigned)

io.on('connect', socket => {
    console.log('New connection')

    socket.on('disconnect', () => {
        console.log('Someone disconnected')
    })
})

server.listen(SERVER_PORT, () => {
    console.log(`Listening on port ${SERVER_PORT}`)
})