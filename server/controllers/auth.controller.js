const errorHandler = require('../middlewares/errorHandler')
const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const customError = require('../utils/customError')


const signup = async (req, res, next) => {
    const { username, email, password } = req.body

    try {
        const hashedPassword = bcrypt.hashSync(password, 10)
        const newUser = new User({ username, email, password: hashedPassword })
        await newUser.save()
        res.status(201).json('user created successfully')

    } catch (error) {
        next(error)


    }

}

const signin = async (req, res, next) => {
    const { email, password } = req.body

    try {
        const validUser = await User.findOne({ email })
        if (!validUser) {
            return next(customError(404, 'User not found!'))
        }
        const validPassword = await bcrypt.compareSync(password, validUser.password)
        if (!validPassword) {
            return next(customError(401, 'Invalid credential!'))
        }

        const token = await jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        const { password: pass, ...rest } = validUser._doc
        res.cookie('access_token', token, { httpOnly: true })
        res.status(200).json(rest)



    } catch (error) {
        console.log("error-----", error)
        next(error)


    }

}

const google = async (req, res, next) => {
    try {
        const { name, email, photo } = req.body
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            const { password: pass, ...rest } = user._doc
            res.cookie('access-token', token, { httpOnly: true })
                .status(200)
                .json({ statusCode: 200, error: false, data: rest })
        } else {
            const genratedPassword = Math.random().toString(36).slice(-8);

            const hashedPassword = bcrypt.hashSync(genratedPassword, 10)
            const newUser = new User({
                username: name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
                email,
                password: hashedPassword,
                avatar: photo
            })
            await newUser.save()
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
            console.log("newUser ---", newUser)
            const { password: pass, ...rest } = newUser._doc;
            res.cookie('access-token', token, { httpOnly: true }).status(200).json({ statusCode: 200, error: false, data: rest })

        }

    } catch (error) {
        console.log("error-----", error)
        next(error)
    }
}

module.exports = {
    signup,
    signin,
    google
}