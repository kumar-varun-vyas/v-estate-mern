
const errorHandler = (err, req, res, next) => {
    console.log("err--", err)

    const statusCode = err.statusCode || 500;
    const errMessage = err.message || "Internal Server Error!"

    return res.status(statusCode).json({
        success: false,
        statusCode,
        errMessage
    })
}

module.exports = errorHandler