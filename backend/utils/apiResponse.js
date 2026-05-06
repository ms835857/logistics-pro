const apiResponse = {
    success: (res, message, data = {}, statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            statusCode
        });
    },
    error: (res, message, error = null, statusCode = 500) => {
        return res.status(statusCode).json({
            success: false,
            message,
            error,
            statusCode
        });
    }
};

module.exports = apiResponse;
