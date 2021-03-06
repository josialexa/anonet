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
const mc = require('./controllers/modController')
const bc = require('./controllers/banController')
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

app.set('io', io)

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
app.get('api/users/modsBans', uc.getModsBans)
app.get('/api/users/:id', uc.read)
app.put('/api/users/', am.selfOnly, uc.update)
app.delete('/api/users/:id', am.selfOnly, uc.delete)

app.post('/api/rooms', rc.create)
app.get('/api/rooms', rc.read)
app.put('/api/rooms/:id', rc.update)
app.delete('/api/rooms/:id', rc.delete)

app.post('/api/moderators', am.ownersOnly, mc.create)
app.get('/api/moderators', am.ownersOnly, mc.read)
app.delete('/api/moderators/:id', am.ownersOnly, mc.delete)

app.post('/api/bans', am.modsOnly, bc.create)
app.get('/api/bans', am.modsOnly, bc.read)
app.put('/api/bans/:id', am.modsOnly, bc.update)
app.delete('/api/bans/:id', am.modsOnly, bc.delete)

app.get('/api/media/sign-s3', sc.getSigned)

// io.origins('http://172.31.99.73:4000')
// io.use(im.usersOnly)
io.on('connect', socket => {
    console.log('New connection', socket.id)
    
    // const db = app.get('db')
    // socket.use(im.ownersOnly)
    
    socket.on('join-room', async (localTime, room, user) => {
        socket.user = user
        let banList = await app.get('db').ban.readRoom(room.id)
        let modList = await app.get('db').moderator.readRoom(room.id)
        // console.log(banList)
        /*&& banList.findIndex(v => v.user_id == user.id) == -1*/

        if((!roomUsers[room.name] || roomUsers[room.name].indexOf(user) == -1)) {
            // console.log('joining room', socket.user.username)
            socket.join(room.name, () => {
                
                // console.log(Object.keys(socket.rooms))
                if(!roomUsers[room.name]) roomUsers[room.name] = []
                user.socket = socket.id
                if(modList.findIndex(v => v.user_id == user.id) != -1) room.isMod = true
                else room.isMod = false
                roomUsers[room.name].push(user)
                // console.log(roomUsers)
                // console.log(room)
                io.to(room.name).emit('join-room-response',{
                    localTime: localTime,
                    room: room,
                    message: `${user.username} has entered the room!`,
                    user
                })
            })
        }
    })

    socket.on('get-room-users', room => {
        // console.log(roomUsers)
        io.to(room.name).emit('set-room-users', roomUsers[room.name])
    })

    socket.on('send-message', msg => {
        console.log('send-message-response:', msg)
        socket.to(msg.room.name).emit('send-message-response', {
            localTime: msg.localTime,
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

    socket.on('add-mod-request', async (user, room) => {
        let addMod
        try {
            addMod = await app.get('db').moderator.create(user.id, room.id)
        } catch(err) {
            console.log('Adding mod', err)
            return
        }

        room.isMod = true
        socket.to(user.socket).emit('add-mod-response', user, room)
    })

    socket.on('remove-mod-request', async (user, room) => {
        let removeMod
        try {
            removeMod = await app.get('db').moderator.deleteUserRoom(user.id, room.id)
        } catch(err) {
            console.log('Removing mod', err)
        }

        room.isMod = false
        socket.to(user.socket).emit('remove-mod-response', user, room)
    })

    socket.on('add-ban-request', async (user, room, ban) => {
        let addBan
        try {
            addBan = await app.get('db').ban.create(user.id, room.id, ban.banEnd, ban.reason, ban.bannedBy)
        } catch(err) {
            console.log('Create ban', err)
            return
        }

        socket.to(user.socket).emit('add-ban-response', user, room, ban)
    })

    socket.on('remove-ban-request', async (user, room, ban) => {
        let removeBan
        try {
            removeBan = await app.get('db').ban.deleteUserRoom(user.id, room.id)
        } catch(err) {
            console.log('Remove ban', err)
            return
        }

        socket.to(user.socket).emit('remove-ban-response', user, room, ban)
    })

    socket.on('disconnect', reason => {
        console.log('Someone disconnected', socket.id, reason)
        for(room in roomUsers) {
            roomUsers[room].filter(v => v.id != socket.user.id)
            io.to(room.name).emit('set-room-users', roomUsers[room.name])
        }
    })
})

server.listen(SERVER_PORT, () => {
    console.log(`Listening on port ${SERVER_PORT}`)
})