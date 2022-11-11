const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    companyid: {
        type: String,
        required: true
    },
    companyname: {
        type: String,
    },
    title: {
        type: String,
    },
    description: { type: String },
    no_of_vacancies: {
        type: Number,
    },
    experience: { type: String },
    basic_pay: { type: String },
    functional_area: { type: String },
    location: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    industry: { type: String },
    ug_qualification: { type: String },
    pg_qualification: { type: String },
    desired_candidate_profile: { type: String },
})

module.exports = mongoose.model('Job', jobSchema)