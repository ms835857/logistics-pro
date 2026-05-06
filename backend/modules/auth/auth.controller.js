const authService = require('./auth.service');
const generateToken = require('../../utils/generateToken');
const apiResponse = require('../../utils/apiResponse');

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return apiResponse.error(res, 'Please provide all required fields', null, 400);
        }

        const user = await authService.registerUser({ name, email, password });
        const token = generateToken(user._id, user.email, user.role);

        return apiResponse.success(res, 'User registered successfully', {
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        }, 201);
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return apiResponse.error(res, 'Please provide email and password', null, 400);
        }

        const user = await authService.loginUser(email, password);
        const token = generateToken(user._id, user.email, user.role);

        return apiResponse.success(res, 'Login successful', {
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        }, 200);
    } catch (error) {
        return apiResponse.error(res, error.message, null, 401);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await authService.getUserById(req.user.id);
        return apiResponse.success(res, 'User profile fetched successfully', user, 200);
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getMe };
