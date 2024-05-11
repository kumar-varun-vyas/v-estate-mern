const User = require('../models/user.model');
const customError = require('../utils/customError');
const bcryptjs = require('bcryptjs')

const updateUser = async (req, res, next) => {
    const id = req.params.id
    let { username, email, avatar } = req.body
    try {
        if (id !== req.user.id) return next(customError(401, "You can only update your own account"))
        let hashPassword
        if (req.body.password) {
            hashPassword = bcryptjs.hashSync(req.body.password, 10)
        }
        const updateUser = await User.findByIdAndUpdate(id, {
            $set: {
                username,
                password: hashPassword,
                email,
                avatar

            }
        }, { new: true })

        const { password, ...rest } = updateUser._doc
        res.status(200).json({
            success: true,
            message: "user update successfull",
            data: rest
        })


    } catch (err) {
        console.log(err)
    }

}

module.exports = {
    updateUser
}