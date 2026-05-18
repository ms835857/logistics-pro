const jwt = require('jsonwebtoken');

const generateToken = (id, email, role, name, company_name) => {
    return jwt.sign({ id, email, role, name, company_name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

module.exports = generateToken;
