const User = require('../models/user.model')
const bcrypt = require('bcryptjs')


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

module.exports = {
    signup
}