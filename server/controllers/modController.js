module.exports = {
    create: (req, res) => {
        const db = req.app.get('db')
        const {roomId, userId} = req.body

        db.moderator.create(userId, roomId)
            .then(result => {
                res.sendStatus(200)
            })
            .catch(err => {
                console.log('Create mod:', err)
                res.status(500).json({message: 'Could not create moderator'})
            })
    },
    read: (req, res) => {
        const db = req.app.get('db')
        const {roomId, userId, modId} = req.query

        if(roomId) {
            db.moderator.readRoom(roomId)
                .then(result => {
                    res.status(200).json(result)
                })
                .catch(err => {
                    console.log('Read room mods', err)
                    res.status(500).json({message: 'Could not get room moderator list'})
                })
        } else if(userId) {
            db.moderator.readMod(userId)
                .then(result => {
                    res.status(200).json(result)
                })
                .catch(err => {
                    console.log('Read mod rooms', err)
                    res.status(500).json({message: 'Could not get moderator room list'})
                })
        } else {
            db.moderator.readOne(modId)
                .then(result => {
                    res.status(200).json(result)
                })
                .catch(err => {
                    console.log('Read single mod', err)
                    res.status(500).json({message: 'Could not get mod'})
                })
        }
    },
    delete: (req, res) => {
        const db = req.app.get('db')
        const {id} = req.params

        db.moderator.delete(id)
            .then(result => {
                res.sendStatus(200)
            })
            .catch(err => {
                console.log('Delete mod', err)
                res.status(500).json({message: 'Could not delete moderator'})
            })
    }
}