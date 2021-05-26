const mongoose = require('mongoose');
const astrologerSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    specialisation: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    cost: {
        type: String,
        required: true
    },
    astroResetLink: {
        data: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('astrologerData', astrologerSchema);