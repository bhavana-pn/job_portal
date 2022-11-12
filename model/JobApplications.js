//create mongoose schema 
const mongoose = require('mongoose')

const jobApplicationSchema = new mongoose.Schema({
    jobid: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    },
    companyid: {
        type: String,
        required: true
    },
    companyname: {
        type: String,
    },
    jobtitle: {
        type: String,
    },
    status: {
        type: String,
        default: 'Pending'
    }
});
module.exports = mongoose.model('JobApplication', jobApplicationSchema)