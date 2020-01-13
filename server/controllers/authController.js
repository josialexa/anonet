const bcrypt = require('bcrypt')

module.exports = {
    login: (req, res) => {
        const {username, password} = req.body
        const db = req.app.get('db')

        db.user.get(username)
            .then(existingUser => {
                if(existingUser[0]) {
                    bcrypt.compare(password, existingUser[0].hash).then(result => {
                        if(result) {
                            req.session.user = {
                                username: existingUser[0].username,
                                userSince: existingUser[0].user_since
                            }
                            res.status(200).json(req.session.user)
                        } else {
                            res.status(401).json({message: 'Incorrect username or password'})
                            // res.status(401).send
                        }
                    })
                } else {
                    res.status(401).json({message: 'Incorrect username or password'})
                }
            })
            .catch(err => {
                console.log('DB Error:', err)
                res.status(500).json({message: 'Database error; unable to log in!'})
            })

    },
    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    },
    register: (req, res) => {
        const {username, password} = req.body
        const db = req.app.get('db')

        db.user.get(username)
            .then(existingUser => {
                if(existingUser[0]) {
                    res.status(400).json({message: 'User already exists!'})
                } else {
                    bcrypt.genSalt(10)
                        .then(salt => {
                            bcrypt.hash(password, salt)
                                .then(hash => {
                                    db.user.create(username, hash)
                                        .then(newUser => {
                                            req.session.user = {
                                                username: newUser[0].username,
                                                userSince: newUser[0].user_since
                                            }
                                            res.status(200).json(req.session.user)
                                        })
                                        .catch(err => {
                                            console.log('DB Error:', err)
                                            res.status(500).json({message: 'Database error; unable to create account!'})
                                        })
                                })
                                .catch(err => {
                                    console.log('Error creating hash:', err)
                                    res.status(500).json({message: 'Error creating account!'})
                                })
                        })
                        .catch(err => {
                            console.log('Error generating salt:', err)
                            res.status(500).json({message: 'Error creating account!'})
                        })
                }
            })
            .catch(err => {
                console.log('DB error', err)
                res.status(500).json({message: 'Database error; unable to create account!'})
            })
    }
}