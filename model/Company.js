const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  compname: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  type: {
    type: Boolean,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
