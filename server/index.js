require('dotenv').config()
const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const massive = require('massive')
const session = require('express-session')
// const s3 = require('aws-sdk')
const ac = require('./controllers/authController')
const sc = require('./controllers/s3Controller')
const uc = require('./controllers/userController')
const rc = require('./controllers/roomController')
// const bcrypt = require('bcrypt')

const app = express()
const server = http.Server(app)
const io = socketio(server)
const {SERVER_PORT, SESSION_SECRET, DB_STRING} = process.env
const roomUsers = {}

massive(DB_STRING).then(db => {
    app.set('db', db)
    console.log('DB connected!')
})

// app.use(express.static(__dirname + '/../build'))
app.use(express.json())
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

app.post('/auth/login', ac.login)
app.post('/auth/register', ac.register)
app.get('/auth/logout', ac.logout)

app.get('/api/users/:id', uc.read)
app.put('/api/users/', uc.update)

app.post('/api/rooms', rc.create)
app.get('/api/rooms', rc.readAll)

app.get('/api/media/sign-s3', sc.getSigned)

io.on('connect', socket => {
    console.log('New connection')

    socket.on('join-room', (room, user) => {
        // console.log(room, user)
        if(!roomUsers[room.name] || roomUsers[room.name].indexOf(user.username) == -1) {
            console.log('joining room')
            socket.join(room.name)
            if(!roomUsers[room.name]) roomUsers[room.name] = []
            roomUsers[room.name].push(user)
            // console.log(roomUsers)
            console.log(room)
            io.in(room.name).emit('join-room-response',{
                room: room,
                message: `${user.username} has entered the room!`,
                users: roomUsers[room.name].map(v => v.username)
            })
        }
    })

    socket.on('get-room-users', room => {
        io.to(room).emit('set-room-users', roomUsers[room])
    })

    socket.on('send-message', msg => {
        io.to(msg.room).emit('send-message-response', {
            room: msg.room,
            user: msg.user,
            message: msg.message
        })
    })

    socket.on('disconnect', () => {
        console.log('Someone disconnected')
    })
})

server.listen(SERVER_PORT, () => {
    console.log(`Listening on port ${SERVER_PORT}`)
})