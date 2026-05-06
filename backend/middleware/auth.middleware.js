const jwt = require('jsonwebtoken');
const apiResponse = require('../utils/apiResponse');

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // { id, email, role }

            next();
        } catch (error) {
            return apiResponse.error(res, 'Not authorized, token failed', error.message, 401);
        }
    }

    if (!token) {
        return apiResponse.error(res, 'Not authorized, no token', null, 401);
    }
};

module.exports = { protect };
