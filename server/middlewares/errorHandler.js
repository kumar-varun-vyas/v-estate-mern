
const errorHandler = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;
    const errMessage = err.errMessage || "Internal Server Error!"

    return res.status(statusCode).json({
        success: false,
        statusCode,
        errMessage
    })
}

module.exports = errorHandler