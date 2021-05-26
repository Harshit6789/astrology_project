const mongoose = require('mongoose');
const astrologerPackageSchema = new mongoose.Schema({

    packageName: {
        type: String,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    days: {
        type: Number,
        required: true
    },
    packageCost: {
        type: Number,
        required: true
    },
    astrologerType: {
        type: String,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('astrologerPackageData', astrologerPackageSchema);