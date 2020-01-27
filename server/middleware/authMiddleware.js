module.exports = {
    usersOnly: (req, res, next) => {
        if(req.session.user) {
            next()
        } else {
            console.log('Not logged in')
            res.status(401).json({message: 'Please log in'})
        }
    },
    selfOnly: (req, res, next) => {
        console.log(req.session.user.username, req.body.username)
        if(req.session.user.username == req.body.username) {
            next()
        } else {
            console.log('Self error')
            res.status(403).json({message: 'You must be logged in as the requested user'})
        }
    },
    ownersOnly: (req, res, next) => {
        const db = req.app.get('db')
        const roomId = req.params.id || req.query.roomId || req.body.roomId || req.body.room.id

        db.room.getOwned(req.session.user.id)
            .then(results => {
                if(results.findIndex(v => v.id == roomId) != -1) {
                    next()
                } else {
                    console.log('Owner error')
                    res.status(403).json({message: 'You do not own this room!'})
                }
            })
            .catch(err => {
                console.log('Getting owned rooms:', err)
                res.status(500).json({message: 'Error getting owned rooms'})
            })
    },
    modsOnly: (req, res, next) => {
        const db = req.app.get('db')
        const roomId = req.params.id || req.query.roomId || req.body.roomId || req.body.room.id

        db.moderator.readMod(req.session.user.id)
            .then(result => {
                console.log(result)
                if(result.findIndex(v => v.room_id = roomId) != -1) {
                    next()
                } else {
                    db.room.getOwned(req.session.user.id)
                        .then(rooms => {
                            if(rooms.findIndex(w => w.id == roomId) != -1) {
                                next()
                            } else {
                                res.status(403).json({message: 'You need to be a moderator or room owner to complete this action'})
                            }
                        })
                        .catch(err => {
                            console.log('Getting owned rooms', err)
                            res.status(500).json({message: 'Could not get owned rooms'})
                        })
                }
            })
            .catch(err => {
                console.log('Getting moderators', err)
                res.status(500).json({message: 'Could not get moderators'})
            })
    }
}