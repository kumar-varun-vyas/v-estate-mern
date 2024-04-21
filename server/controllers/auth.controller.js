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

module.exports = {
    signup,
    signin
}