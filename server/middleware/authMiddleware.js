module.exports = {
    usersOnly: (req, res, next) => {
        if(req.session.user) {
            next()
        } else {
            res.status(401).json({message: 'Please log in'})
        }
    },
    selfOnly: (req, res, next) => {
        if(req.session.user.username == req.body.username) {
            next()
        } else {
            res.status(403).json({message: 'You must be logged in as the requested user'})
        }
    },
    ownersOnly: (req, res, next) => {
        const db = req.app.get('db')
        const roomId = req.params.id

        db.room.getOwned(req.session.user.id)
            .then(results => {
                if(results.findIndex(v => v.id == roomId) != -1) {
                    next()
                } else {
                    res.status(403).json({message: 'You do not own this room!'})
                }
            })
            .catch(err => {
                console.log('Getting owned rooms:', err)
            })
    }
}