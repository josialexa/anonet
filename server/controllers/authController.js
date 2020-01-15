const bcrypt = require('bcrypt')

module.exports = {
    login: (req, res) => {
        const {username, password} = req.body
        const db = req.app.get('db')

        //gets user from database by username, enforces unique user names in app
        db.user.getLogin(username)
            .then(existingUser => {
                //if the user exists, compare the password to the hash
                if(existingUser[0]) {
                    bcrypt.compare(password, existingUser[0].hash).then(result => {
                        if(result) {
                            //if compare is successful, store user to session and send
                            req.session.user = {
                                id: existingUser[0].id,
                                username: existingUser[0].username,
                                userSince: existingUser[0].user_since,
                                profileImgUrl: existingUser[0].profile_img_url,
                                primaryColor: existingUser[0].primary_color
                            }
                            res.status(200).json(req.session.user)
                        } else {
                            res.status(401).json({message: 'Incorrect username or password'})
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

        db.user.getLogin(username)
            .then(existingUser => {
                if(existingUser[0]) {
                    res.status(400).json({message: 'User already exists!'})
                } else {
                    //generate salt
                    bcrypt.genSalt(10)
                        .then(salt => {
                            //generate new password hash with salt
                            bcrypt.hash(password, salt)
                                .then(hash => {
                                    //store username and salt in db
                                    db.user.create(username, hash, '#4eeefc', '/images/defaultUser.png')
                                        .then(newUser => {
                                            //store new user to session and send it back
                                            req.session.user = {
                                                id: newUser[0].id,
                                                username: newUser[0].username,
                                                userSince: newUser[0].user_since,
                                                primaryColor: newUser[0].primary_color,
                                                profileImgUrl: newUser[0].profile_img_url
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