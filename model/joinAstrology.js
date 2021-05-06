const mongoose = require('mongoose');
const joinAstrologySchema = new mongoose.Schema({
    billingperiod : {
        type : String,
        required : true
    },
    fname : {
        type : String,
        required :true
    },
    gender : {
        type : String,
        required :true
    },
    birthdate : {
        type : Date,
        required :true
    },
    birthtime : {
        type : String,
        required :true
    },
    birthlocation : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
    }
});

module.exports = mongoose.model('joinAstrology' , joinAstrologySchema)