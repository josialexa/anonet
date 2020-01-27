module.exports = {
    create: (req, res) => {
        const db = req.app.get('db')
        const io = req.app.get('io')
        const {user, room, banEnd, reason} = req.body

        db.ban.create(user.id, room.id, banEnd, reason, req.session.user.id)
            .then(result => {
                io.to(room.name).emit('ban-user', {
                    user,
                    message: reason,
                    mod: req.session.user
                })
                res.sendStatus(200)
            })
            .catch(err => {
                console.log('Create new ban', err)
                res.status(500).json({message: 'Could not create new ban'})
            })
    },
    read: (req, res) => {
        const db = req.app.get('db')
        const io = req.app.get('io')
        const {roomId, roomName} = req.query

        if(roomId && roomName) {
            db.ban.readRoom(roomId)
                .then(result => {
                    io.to(roomName).emit('room-bans',{
                        bans: result
                    })
                    res.sendStatus(200)
                })
                .catch(err => {
                    console.log('Getting room bans', err)
                    res.status(500).json({message: 'Could not get room bans'})
                })
        } else {
            db.ban.readMod(req.session.user.id)
                .then(result => {
                    res.status(200).json(result)
                })
                .catch(err => {
                    console.log('Getting mod bans', err)
                    res.status(500).json({message: 'Could not get moderator bans'})
                })
        }
    },
    update: (req, res) => {
        const db = req.app.get('db')
        const io = req.app.get('io')
        const id = req.params.id
        const {user, room, banEnd, reason} = req.body
        const modId = req.session.user.id

        db.ban.updateSingle(id, banEnd, modId, reason)
            .then(result => {
                io.to(room.name).emit('update-ban', {
                    user,
                    message: reason,
                    mod: req.session.user
                })
                res.sendStatus(200)
            })
            .catch(err => {
                console.log('Updating ban', err)
                res.status(500).json({message: 'Error updating ban'})
            })
    },
    delete: (req, res) => {
        const db = req.app.get('db')
        const io = req.app.get('io')
        const id = req.params.id

        db.ban.delete(id)
            .then(result => {
                res.sendStatus(200)
            })
            .catch(err => {
                console.log('Delete ban', err)
                res.status(500).json({message: 'Error deleting ban'})
            })
    }
}