module.exports = {
    read: (req, res) => {
        const db = req.app.get('db')

        db.user.get(req.params.id || req.session.user.id)
        //what do i want to use this for?
            // .then(user => {
            //     req.session.user.profileImgUrl = user[0].profile_img_url
            //     req.session.user.primaryColor = user[0].primary_color
            // })
    },
    update: (req, res) => {
        const db = req.app.get('db')
        const {profileImgUrl, primaryColor} = req.body
        const {id} = req.params

        db.user.update(id, primaryColor, profileImgUrl)
            .then(updatedUser => {
                req.session.user = {
                    ...req.session.user,
                    primaryColor: updatedUser[0].primary_color,
                    profileImgUrl: updatedUser[0].profile_img_url
                }

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
    }
}