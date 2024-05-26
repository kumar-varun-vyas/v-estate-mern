module.exports = (statusCode, message) => {
    const error = new Error()
    error.statusCode = statusCode;
    error.success = false;
    error.message = message
    return error;
}
