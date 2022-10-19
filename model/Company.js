const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: Boolean,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
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
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('User', companySchema)