module.exports = {
    read: (req, res) => {
        const db = req.app.get('db')

        db.user.get(req.params.id)
            .then(user => {
                const {id, username, user_since, primary_color, profile_img_url} = user[0]
                console.log(primary_color)
                res.status(200).json({
                    id,
                    username,
                    userSince: user_since,
                    primaryColor: primary_color,
                    profileImgUrl: profile_img_url
                })
            })
            .catch(err => {
                console.log('Get user error:', err)
                res.status(500).json({message: 'Could not retrieve user information'})
            })
    },
    update: (req, res) => {
        const db = req.app.get('db')
        const {profileImgUrl, primaryColor} = req.body
        const id = req.session.user.id

        console.log(id, primaryColor, profileImgUrl)

        db.user.update(id, primaryColor, profileImgUrl)
            .then(updatedUser => {
                req.session.user = {
                    ...req.session.user,
                    primaryColor: updatedUser[0].primary_color,
                    profileImgUrl: updatedUser[0].profile_img_url
                }
                console.log(req.session.user)

                res.status(200).json(req.session.user)
            })
            .catch(err => {
                console.log('Update user:', err)
                res.status(500).json({message: 'Could not update user'})
            })
    },
    delete: (req, res) => {
        const db = req.app.get('db')

        db.user.delete(req.session.user.id)
            .then(() => {
                req.session.destroy()
                res.sendStatus(200)
            })
            .catch(err => {
                console.log('Delete user error:', err)
                res.status(500).json({message: 'Could not delete account'})
            })
    },
    getModsBans: async (req, res) => {
        const db = req.app.get('db')
        let modsBans

        try {
            modsBans = db.user.getRoomsModsBans(req.query.id)
        } catch(err) {
            console.log('Get rooms/mods/bans', err)
            res.status(500).json({message: 'Could not get rooms/mods/bans'})
        }

        res.status(200).json(modsBans)
    }
}