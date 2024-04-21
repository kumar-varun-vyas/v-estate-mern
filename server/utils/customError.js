module.exports = (statusCode, message) => {
    const error = new Error()
    error.statusCode = statusCode;
    error.errMessage = message
    return error;
}
