const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    company_name: {
        type: String,
        required: function() { return this.role === 'user'; }
    },
    company_address: {
        type: String,
        required: function() { return this.role === 'user'; }
    },
    company_phone: {
        type: String,
        required: function() { return this.role === 'user'; }
    },
    industry: {
        type: String,
        enum: ['Retail', 'Manufacturing', 'Healthcare', 'Technology', 'Other'],
        required: function() { return this.role === 'user'; }
    },
    tax_id: {
        type: String,
    },
    is_active: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
