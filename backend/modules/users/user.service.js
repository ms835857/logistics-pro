const User = require('../../models/user.schema');
const bcrypt = require('bcryptjs');

const getMyProfile = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');
    return user;
};

const updateMyProfile = async (userId, updateData) => {
    const { name, email, company_address, company_phone } = updateData;
    
    // Check if email is being updated and if it's already taken
    if (email) {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== userId) {
            throw new Error('Email is already taken');
        }
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { name, email, company_address, company_phone } },
        { new: true, runValidators: true }
    ).select('-password');

    return updatedUser;
};

const updateMyPassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new Error('Incorrect current password');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return { message: 'Password updated successfully' };
};

const getAllUsers = async () => {
    const users = await User.find().select('-password');
    return users;
};

const updateUserRole = async (adminId, userId, newRole) => {
    if (adminId === userId) {
        throw new Error('Cannot change your own role');
    }
    if (!['admin', 'user'].includes(newRole)) {
        throw new Error('Invalid role');
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { role: newRole },
        { new: true }
    ).select('-password');

    if (!updatedUser) throw new Error('User not found');
    return updatedUser;
};

const deleteUser = async (adminId, userId) => {
    if (adminId === userId) {
        throw new Error('Cannot delete your own account');
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) throw new Error('User not found');
    return { message: 'User deleted successfully' };
};

module.exports = {
    getMyProfile,
    updateMyProfile,
    updateMyPassword,
    getAllUsers,
    updateUserRole,
    deleteUser
};
