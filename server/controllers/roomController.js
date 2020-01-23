module.exports = {
    create: (req, res) => {
        const db = req.app.get('db')
        const {roomName, roomTopic} = req.body
        const {id} = req.session.user

        db.room.create(roomName, roomTopic, id)
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                console.log('Create room:', err)
                res.status(500).json({message: 'Error creating room'})
            })
    },
    read: (req, res) => {
        const db = req.app.get('db')

        if(req.query.id) {
            db.room.getOwned(req.query.id)
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                console.log('Get owned rooms:', err)
                res.status(500).json({message: 'Error getting owned rooms'})
            })
        } else {
            db.room.getAll()
                .then(result => {
                    res.status(200).json(result)
                })
                .catch(err => {
                    console.log('Get all rooms:', err)
                    res.status(500).json({message: 'Error getting all rooms'})
                })
        }

    },
    update: (req, res) => {
        const db = req.app.get('db')

        db.room.update(req.params.id, req.body.topic)
            .then(result => {
                res.sendStatus(200)
            })
            .catch(err => {
                console.log('Error updating room:', err)
                res.status(500).json({message: 'Error updating room'})
            })
    },
    delete: (req, res) => {
        const db = req.app.get('db')

        db.room.deleteOne(req.params.id)
            .then(result => {
                res.sendStatus(200)
            })
            .catch(err => {
                console.log('Delete room:', err)
                res.status(500).json({message: 'Error deleting room'})
            })
    }
}