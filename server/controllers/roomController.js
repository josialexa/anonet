module.exports = {
    create: (req, res) => {
        const db = req.app.get('db')
        const {name, topic} = req.body
        const {id} = req.session.user

        db.room.create(name, topic, id)
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                console.log('Create room:', err)
                res.status(500).json({message: 'Error creating room'})
            })
    },
    readAll: (req, res) => {
        const db = req.app.get('db')

        db.room.getAll()
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                console.log('Get all rooms:', err)
                res.status(500).json({message: 'Error getting all rooms'})
            })
    },
    readOwned: (req, res) => {},
    update: (req, res) => {},
    delete: (req, res) => {}
}