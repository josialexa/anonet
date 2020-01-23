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
const am = require('./middleware/authMiddleware')
const im = require('./middleware/ioMiddleware')
// const bcrypt = require('bcrypt')

const app = express()
const server = http.Server(app)
const io = socketio(server, {pingTimeout: 10000})
const {SERVER_PORT, SESSION_SECRET, DB_STRING} = process.env
const roomUsers = {}
const users = []

massive(DB_STRING).then(db => {
    app.set('db', db)
    // io.use((socket, next) => {
    //     return next(db)
    // })
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

app.use(am.usersOnly)
app.get('/api/users/:id', uc.read)
app.put('/api/users/', am.selfOnly, uc.update)
app.delete('/api/users/:id', am.selfOnly, uc.delete)

app.post('/api/rooms', rc.create)
app.get('/api/rooms', rc.read)
app.put('/api/rooms/:id', rc.update)
app.delete('/api/rooms/:id', rc.delete)

app.get('/api/media/sign-s3', sc.getSigned)

// io.origins('http://172.31.99.73:4000')
io.use(im.usersOnly)
io.on('connect', socket => {
    console.log('New connection', socket.id)
    socket.use(im.ownersOnly)
    
    socket.on('join-room', (room, user) => {
        socket.user = user
        if(!roomUsers[room.name] || roomUsers[room.name].indexOf(user) == -1) {
            // console.log('joining room', socket.user.username)
            socket.join(room.name, () => {
                
                // console.log(Object.keys(socket.rooms))
                if(!roomUsers[room.name]) roomUsers[room.name] = []
                roomUsers[room.name].push(user)
                // console.log(roomUsers)
                // console.log(room)
                socket.to(room.name).emit('join-room-response',{
                    room: room,
                    message: `${user.username} has entered the room!`,
                    users: roomUsers[room.name].map(v => v.username)
                })
            })
        }
    })

    socket.on('get-room-users', room => {
        console.log(roomUsers)
        io.to(room.name).emit('set-room-users', roomUsers[room.name])
    })

    socket.on('send-message', msg => {
        // console.log('send-message-response:', msg)
        socket.to(msg.room).emit('send-message-response', {
            room: msg.room,
            user: msg.user,
            message: msg.message
        })
    })

    socket.on('leave-room', room => {
        socket.leave(room, () => {
            roomUsers[room.name].splice(roomUsers[room.name].indexOf(socket.user), 1)
            io.to(room.name).emit('set-room-users', roomUsers[room.name])
        })
    })

    socket.on('disconnect', reason => {
        console.log('Someone disconnected', socket.id, reason)
    })
})

server.listen(SERVER_PORT, () => {
    console.log(`Listening on port ${SERVER_PORT}`)
})