const User = require('../../models/user.schema');
const bcrypt = require('bcryptjs');

const registerUser = async (userData) => {
    const { name, email, password, company_name, company_address, company_phone, industry, tax_id } = userData;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        company_name,
        company_address,
        company_phone,
        industry,
        tax_id,
        role: 'user', // strictly default to 'user' from public registration
    });

    return user;
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        return user;
    } else {
        throw new Error('Invalid email or password');
    }
};

const getUserById = async (id) => {
    const user = await User.findById(id).select('-password');
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

module.exports = {
    registerUser,
    loginUser,
    getUserById
};
