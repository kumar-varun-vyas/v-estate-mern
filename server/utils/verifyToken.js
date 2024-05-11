const customError = require("./customError")
const jwt = require('jsonwebtoken')
const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.access_token
        console.log("token---", token)
        if (!token) return next(customError(401, "Unautherised"))

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return next(customError(403, "forbidden"))

            req.user = user
            next()
        })
    } catch (err) {
        console.log('verify token error', err)
    }
}

module.exports = { verifyToken }