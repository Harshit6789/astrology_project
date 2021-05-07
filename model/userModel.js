const mongoose = require('mongoose');
const astroUserSchema = new mongoose.Schema({
  
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
    isadmin: {
        type: Boolean,
        default: false
    },
    resetLink: {
        data: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('userdata', astroUserSchema);