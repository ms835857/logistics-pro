const apiResponse = require('../utils/apiResponse');

const checkOwnership = (resourceUserId, req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    
    if (resourceUserId !== req.user.id) {
        return apiResponse.error(res, 'Access denied: not your resource', null, 403);
    }
    
    next();
};

module.exports = { checkOwnership };
