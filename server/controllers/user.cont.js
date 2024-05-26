const User = require('../models/user.model');
const customError = require('../utils/customError');
const bcryptjs = require('bcryptjs')

const updateUser = async (req, res, next) => {
    const id = req.params.id
    let { username, email, avatar } = req.body
    console.log("update user -", username, email, avatar)
    try {
        if (id !== req.user.id) return next(customError(401, "You can only update your own account"))
        let hashPassword
        if (req.body.password) {
            hashPassword = bcryptjs.hashSync(req.body.password, 10)
        }
        if (username) {
            let isUserExist = await User.findOne({ username })
            if (isUserExist && isUserExist.username && isUserExist._id !== id) {
                return next(customError(401, "User name already exists"))
            }
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
        console.log('update user error----', err)
        next(customError(500, "Internal server error"))
    }
}

const deleteUser = async (req, res, next) => {
    const id = req.params.id
    try {
        if (id !== req.user.id) return next(customError(401, "You can only update your own account"))
        await User.findByIdAndDelete(id)
        res.clearCookie("access_token")
        res.status(200).json({
            success: true,
            message: "user deleted successfull!"
        })


    } catch (err) {
        console.log("dlt err--", err)
        next(customError(500, "Internal server error"))
    }
}



const signOut = async (req, res, next) => {
    console.log("signout calling");
    try {
        res.clearCookie("access_token")
        res.status(200).json({
            success: true,
            message: "user has been signout!"
        })

    } catch (err) {
        console.log(err)
        next(customError(500, "Internal server error"))
    }
}

module.exports = {
    updateUser,
    deleteUser,
    signOut
}