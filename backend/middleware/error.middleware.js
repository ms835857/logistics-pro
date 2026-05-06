const apiResponse = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    apiResponse.error(res, err.message, process.env.NODE_ENV === 'development' ? err.stack : null, statusCode);
};

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = { errorHandler, notFound };
