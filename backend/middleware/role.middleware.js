const apiResponse = require('../utils/apiResponse');

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return apiResponse.error(res, 'Forbidden: Admin access required', null, 403);
    }
};

module.exports = { adminOnly };
