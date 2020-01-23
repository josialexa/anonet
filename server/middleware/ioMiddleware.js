module.exports = {
    usersOnly: (socket, next) => {
        // console.log(socket.db)
        if(socket.request.headers.cookie) return next()
        next(new Error('Authentication error'))
    },
    ownersOnly: (packet, next) => {
        console.log('packet here:', packet[1].name)
        next()
    },
    modsOnly: (socket, next) => {

    },
    banned: (socket, next) => {

    }
}