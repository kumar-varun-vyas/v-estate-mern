module.exports = (statusCode, message) => {
    const error = new Error()
    error.statusCode = statusCode;
    error.error = true;
    error.errMessage = message
    return error;
}
